import os
import shutil
import redis
from langchain.agents import AgentExecutor
from langchain.agents.format_scratchpad import format_to_openai_functions
from langchain.agents.output_parsers import OpenAIFunctionsAgentOutputParser
from langchain.memory import ConversationBufferMemory
from langchain_openai import ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain_openai.embeddings import OpenAIEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.tools import tool
from dotenv import load_dotenv
import hashlib
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.chat_message_histories import RedisChatMessageHistory


# Load environment variables from .env file
load_dotenv()

# Initialize Redis connection (adjust URL for your Redis server)
redis_client = redis.Redis(host=os.getenv("REDIS_HOST"), port=os.getenv("REDIS_PORT"), password=os.getenv("REDIS_PASSWORD"), ssl=True)

# Constants
VECTOR_DB_ROOT = "artifacts/resume_vectorstore"
CURRENT_RESUME_FILE = "artifacts/current_resume_path.txt"

def get_vectorstore_path(pdf_path: str) -> str:
    hash_value = hashlib.md5(pdf_path.encode("utf-8")).hexdigest()
    return os.path.join(VECTOR_DB_ROOT, hash_value)

def save_current_resume_path(pdf_path: str):
    # Ensure the directory exists
    os.makedirs(os.path.dirname(CURRENT_RESUME_FILE), exist_ok=True)
    with open(CURRENT_RESUME_FILE, "w") as f:
        f.write(pdf_path)

def load_current_resume_path() -> str:
    if not os.path.exists(CURRENT_RESUME_FILE):
        raise ValueError("Current resume path not set. Please process a resume first.")
    with open(CURRENT_RESUME_FILE, "r") as f:
        return f.read().strip()

def process_resume_to_vectordb(pdf_path: str, force_reload: bool = False) -> FAISS:
    print("Processing resume to vector database...")
    
    # Ensure output directory exists
    os.makedirs(VECTOR_DB_ROOT, exist_ok=True)
    
    vectorstore_path = get_vectorstore_path(pdf_path)
    
    if not force_reload and os.path.exists(vectorstore_path) and os.path.isdir(vectorstore_path):
        try:
            print(f"Loading existing vector database from {vectorstore_path}")
            embeddings = OpenAIEmbeddings()
            return FAISS.load_local(vectorstore_path, embeddings, allow_dangerous_deserialization=True)
        except Exception as e:
            print(f"Could not load existing vector database: {e}. Will create a new one.")

    try:
        if not os.path.exists(pdf_path) or os.path.getsize(pdf_path) == 0:
            raise ValueError(f"Invalid PDF file: {pdf_path}")
        
        loader = PyPDFLoader(pdf_path)
        documents = loader.load()
        if not documents:
            raise ValueError("No content could be extracted from the PDF.")
        
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        chunks = text_splitter.split_documents(documents)

        embeddings = OpenAIEmbeddings()
        vectorstore = FAISS.from_documents(chunks, embeddings)

        if os.path.exists(vectorstore_path):
            shutil.rmtree(vectorstore_path)
        os.makedirs(vectorstore_path, exist_ok=True)
        vectorstore.save_local(vectorstore_path)

        save_current_resume_path(pdf_path)

        print(f"Resume processed and stored at {vectorstore_path}")
        return vectorstore

    except Exception as e:
        raise ValueError(f"Error processing resume: {str(e)}")

@tool
def search_resume(query: str) -> str:
    """
    Searches the resume for information relevant to the query.
    """
    print("Searching resume with query:", query)
    try:
        # Get the current resume path
        current_resume_path = load_current_resume_path()
        vectorstore_path = get_vectorstore_path(current_resume_path)
        
        if not os.path.exists(vectorstore_path) or not os.path.isdir(vectorstore_path):
            return "Error: Resume database not found. Please process a resume first."
        
        embeddings = OpenAIEmbeddings()
        vectorstore = FAISS.load_local(vectorstore_path, embeddings, allow_dangerous_deserialization=True)
        
        docs = vectorstore.similarity_search(query, k=3)
        if not docs:
            return "No relevant information found in the resume for this query."
        
        results = "\n\n".join([doc.page_content for doc in docs])
        return f"Relevant information from the resume:\n{results}"
    except Exception as e:
        return f"Error searching resume: {str(e)}"

def create_resume_agent(user_id: str) -> AgentExecutor:
    """
    Creates and returns a new agent for the user.
    Uses Redis to load/save user memory (conversation history).
    """
    print("Creating resume agent for user:", user_id)
    
    # Create LLM
    llm = ChatOpenAI(model="gpt-4o", temperature=0)
    
    # Create tools list
    tools = [search_resume]
    
    # Load user memory from Redis (if it exists)
    chat_history = RedisChatMessageHistory(
        session_id=user_id,
        url=os.getenv("REDIS_URL"),
    )

    memory = ConversationBufferMemory(
        memory_key="chat_history",
        return_messages=True,
        chat_memory=chat_history
    )
    
    # Create system prompt
    system_prompt = """You are a helpful assistant that analyzes resumes. 
    Use the tools available to search the resume for relevant information.
    Always be professional and answer based on the actual resume content.
    If information is not found in the resume, be honest about it."""
    
    # Create the agent using the recommended method for OpenAI functions agent
    from langchain.agents.format_scratchpad import format_to_openai_functions
    from langchain.agents.output_parsers import OpenAIFunctionsAgentOutputParser
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("placeholder", "{chat_history}"),
        ("human", "{input}"),
    ])
    
    # Create the agent
    agent = (
        {
            "input": lambda x: x["input"],
            "chat_history": lambda x: x.get("chat_history", ""),
            "agent_scratchpad": lambda x: format_to_openai_functions(x.get("intermediate_steps", [])),
        }
        | prompt
        | llm.bind(functions=[tool.to_openai_function() for tool in tools])
        | OpenAIFunctionsAgentOutputParser()
    )
    
    # Create the agent executor with the agent
    agent_executor = AgentExecutor(
        agent=agent,
        tools=tools,
        memory=memory,
        verbose=True,
        handle_parsing_errors=True
    )
    
    return agent_executor

def answer_resume_question(user_id: str, question: str) -> str:
    """
    Answers a question about the resume using the RAG agent.
    
    Args:
        user_id: The user identifier to retrieve the conversation history
        question: The question to ask about the resume
        
    Returns:
        The answer to the question
    """
    print("Answering resume question for user:", user_id)
    try:
        # Create or get the existing agent for the user
        agent_executor = create_resume_agent(user_id)

        # Invoke the agent to respond to the user's message
        response = agent_executor.invoke({"input": question})

        # Defensive extraction
        if isinstance(response, dict) and "output" in response:
            answer = response["output"]
        else:
            answer = "Sorry, I couldn't generate a proper response."
        
        return answer
    except Exception as e:
        print(f"Error answering question: {str(e)}")
        return f"Sorry, I encountered an error: {str(e)}"