import os
import shutil
from PyPDF2 import PdfReader
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_openai import ChatOpenAI
from langchain_redis import RedisChatMessageHistory
from langchain.chains import create_retrieval_chain
from dotenv import load_dotenv


REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

def get_pdf_text(resume_path):
  pdf_reader = PdfReader(resume_path)
  text = ""
  for page in pdf_reader.pages:
    text += page.extract_text()
  return text


def store_resume(file):
  upload_dir = "artifacts"
  os.makedirs(upload_dir, exist_ok=True)
  file_location = os.path.join(upload_dir, "resume.pdf")
  with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
  
  resume_text = get_pdf_text("artifacts/resume.pdf")
  splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
  texts = splitter.split_text(resume_text)

  embeddings = OpenAIEmbeddings()
  db = FAISS.from_texts(texts, embeddings)
  db.save_local("faiss_index")


def ask_llm(session_id, question):
  db = FAISS.load_local("faiss_index", OpenAIEmbeddings())
  history = RedisChatMessageHistory(session_id=session_id, redis_url=REDIS_URL)
  
  retriever = db.as_retriever(k=4)
  llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
  prompt = ChatPromptTemplate.from_messages([
      ("system", "You are a helpful assistant that answers questions about a candidate based on their resume."),
      MessagesPlaceholder(variable_name="chat_history"),
      ("user", "{input}"),
      ("user", "Relevant context from resume:\n{context}")
  ])
  retrieval_chain = create_retrieval_chain(retriever, llm, prompt=prompt)

  response = retrieval_chain.invoke({
        "input": question,
        "chat_history": history
    })
  history.add_user_message(question)
  history.add_system_message(response)

  return response




if __name__ =="__main__":
  load_dotenv()
  session_id = "test_session"  # Unique session ID for the user

  print("Start chatting with your resume-based assistant (type 'exit' to stop)")

  while True:
      # User input
      user_input = input("You: ")
      if user_input.lower() == "exit":
          print("Exiting the chat.")
          break

      # Ask the LLM (using the resume context from FAISS DB)
      response = ask_llm(session_id, user_input)

      print("Bot:", response["answer"])