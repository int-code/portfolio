import os
import shutil
import traceback
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_openai import ChatOpenAI
from langchain_redis import RedisChatMessageHistory
from dotenv import load_dotenv
from langchain.tools.retriever import create_retriever_tool
from langchain.agents import create_tool_calling_agent
from langchain.agents import AgentExecutor
import asyncio



REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

def get_text_file_content(resume_path):
  with open(resume_path, "r", encoding="utf-8") as file:
    text = file.read()
  return text


def store_resume(file):
  upload_dir = "artifacts"
  os.makedirs(upload_dir, exist_ok=True)
  file_location = os.path.join(upload_dir, "resume.txt")
  with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
  
  resume_text = get_text_file_content("artifacts/resume.txt")
  splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
  texts = splitter.split_text(resume_text)

  embeddings = OpenAIEmbeddings()
  db = FAISS.from_texts(texts, embeddings)
  db.save_local("faiss_index")


async def ask_llm(session_id, question):
  db = FAISS.load_local("faiss_index", OpenAIEmbeddings(), allow_dangerous_deserialization=True)
  try:
    history = RedisChatMessageHistory(session_id=session_id, redis_url=REDIS_URL)
  except Exception as e:
     traceback.print_exc()
  retriever = db.as_retriever(k=4)
  llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
  prompt = ChatPromptTemplate.from_messages([
      ("system", "You are a helpful assistant that answers questions about a candidate named Pubali based on their resume. If the context does not have relevant information, just say so, do not make up information"),
      MessagesPlaceholder(variable_name="chat_history", optional=True),
      ("user", "{input}"),
      MessagesPlaceholder(variable_name='agent_scratchpad')
  ])
  # document_chain = create_stuff_documents_chain(llm, prompt)
  # retrieval_chain = create_retrieval_chain(retriever, document_chain)
  retriever_tool = create_retriever_tool(
    retriever,
    "resume_search",
    "Search for information about Pubali. For any questions about my(Pubali) professional life or contact details or website links, you must use this tool!",
  )
  tools = [retriever_tool]

  agent = create_tool_calling_agent(llm, tools, prompt)
  agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=False)
  if len(await history.aget_messages())>0:
    response = agent_executor.invoke({
          "input": question,
          "chat_history": history.messages
      })
  else:
     response = agent_executor.invoke({
          "input": question,
          "chat_history": []
      })
  history.add_user_message(question)
  history.add_ai_message(response["output"])

  return response




if __name__ =="__main__":
  load_dotenv()
  session_id = "f208db36-0721-4d92-a75d-bb203a4284b2"  # Unique session ID for the user

  print("Start chatting with your resume-based assistant (type 'exit' to stop)")

  while True:
      # User input
      user_input = input("You: ")
      if user_input.lower() == "exit":
          print("Exiting the chat.")
          break

      # Ask the LLM (using the resume context from FAISS DB)
      response = asyncio.run(ask_llm(session_id, user_input))

      print("Bot:", response["output"])