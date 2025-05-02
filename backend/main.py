from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, File, UploadFile, HTTPException
from chatbot import process_resume_to_vectordb
from db import Base, engine, get_db
from models import Projects, Skills, ProjectSkills, Chat
from sqlalchemy.orm import Session
from tempfile import NamedTemporaryFile
from pydantic import BaseModel
from chatbot import process_resume_to_vectordb, answer_resume_question

# Sync version of the lifespan function
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables synchronously
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(lifespan=lifespan)

@app.get("/")
def root():
    return {"message": "Hello World"}


@app.get("/projects")
def get_details(db: Session = Depends(get_db)):
    projects = db.query(Projects, Skills).join(ProjectSkills, Projects.id==ProjectSkills.project_id).join(Skills, ProjectSkills.skill_id == Skills.id).all()
    details = {"projects": projects}
    skills = db.query(Skills).order_by(Skills.rating.desc()).limit(6).all()
    details["top_skills"] = skills

    return details


@app.post("/upload_resume/")
async def upload_resume(file: UploadFile = File(...)):
    """
    Endpoint to upload a resume and process it into a vector database.
    """
    try:
        # Create a temporary file to save the uploaded PDF
        with NamedTemporaryFile(delete=False) as tmp_file:
            tmp_file.write(await file.read())
            tmp_file_path = tmp_file.name
        
        # Process resume and store in vector store
        vectorstore = process_resume_to_vectordb(tmp_file_path, force_reload=True)
        
        # Return success message
        return {"message": "Resume uploaded and processed successfully!"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading resume: {str(e)}")
    

@app.post("/chat/")
async def chat_with_bot(user_id: str, message: str):
    """
    Endpoint for users to interact with the resume chatbot.
    """
    try:
        # Get the response from the chatbot
        response = answer_resume_question(user_id, message)
        
        return {"response": response}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in chatbot interaction: {str(e)}")