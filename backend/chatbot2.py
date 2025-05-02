# from langchain.chat_models import init_chat_model
# from langchain_openai import OpenAIEmbeddings
# import faiss
# from langchain_community.docstore.in_memory import InMemoryDocstore
# from langchain_community.vectorstores import FAISS


# llm = init_chat_model("gpt-4o-mini", model_provider="openai")
# embeddings = OpenAIEmbeddings(model="text-embedding-3-large")

# embedding_dim = len(embeddings.embed_query("hello world"))
# index = faiss.IndexFlatL2(embedding_dim)

# vector_store = FAISS(
#     embedding_function=embeddings,
#     index=index,
#     docstore=InMemoryDocstore(),
#     index_to_docstore_id={},
# )


from PyPDF2 import PdfReader

def get_pdf_text(resume_path):
  pdf_reader = PdfReader(resume_path)
  text = ""
  for page in pdf_reader.pages:
    text += page.extract_text()
  return text


def store_resume():
  