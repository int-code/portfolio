from contextlib import asynccontextmanager
import uuid
from fastapi import FastAPI, Depends, File, Request, UploadFile, HTTPException
from fastapi.responses import FileResponse
from db import Base, engine, get_db
from models import Projects, Skills, ProjectSkills, Chat
from sqlalchemy.orm import Session
from tempfile import NamedTemporaryFile
from pydantic import BaseModel
from chatbot import store_resume, ask_llm

# Sync version of the lifespan function
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables synchronously
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(lifespan=lifespan)

@app.middleware("http")
async def add_session_id(request: Request, call_next):
    session_id = request.cookies.get("session_id")

    if not session_id:
        session_id = str(uuid.uuid4())[:25]  # generate a new session ID
        print(session_id)
        response = await call_next(request)
        
        # Set cookie to expire in 30 minutes (1800 seconds)
        response.set_cookie(
            key="session_id",
            value=session_id,
            httponly=True,
            max_age=3600 
        )
        return response
    else:
        response = await call_next(request)
        return response


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
        store_resume(file)
        
        # Return success message
        return {"message": "Resume uploaded and processed successfully!"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading resume: {str(e)}")
    

@app.post("/chat/")
async def chat_with_bot(request: Request, message: str):
    """
    Endpoint for users to interact with the resume chatbot.
    """
    try:
        user_id = request.cookies.get("session_id")
        print(user_id, " bjhadscjsdfc")
        if not user_id:
            raise HTTPException(status_code=400, detail="Session ID missing.")
        # Get the response from the chatbot
        response = await ask_llm(user_id, message)
        print(response)
        
        return {"response": response["output"]}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in chatbot interaction: {str(e)}")
    

@app.get("/get-resume")
def download_file():
    file_path = "artifacts/resume.txt"  # Make sure this file exists
    return FileResponse(
        path=file_path,
        filename="resume-portfolio.txt",  # name the user sees
        media_type="text/plain"
    )