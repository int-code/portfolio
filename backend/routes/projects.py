import os
from typing import Annotated
from uuid import uuid4
from fastapi import APIRouter, Depends, Form, File, HTTPException, UploadFile
from pydantic import BaseModel
from sqlalchemy.orm import Session
from db import get_db

from models import ProjectSkills, Projects, Skills

projectRouter = APIRouter()
@projectRouter.get("/")
def get_details(db: Session = Depends(get_db)):
    projects = db.query(Projects).outerjoin(ProjectSkills, Projects.id == ProjectSkills.project_id).outerjoin(Skills, ProjectSkills.skill_id == Skills.id).all()
    details = {"projects": projects}

    return details


@projectRouter.get("/{project_id}")
def get_project(project_id: int, db: Session = Depends(get_db)):
    project, skill = db.query(Projects, Skills).filter(Projects.id == project_id).outerjoin(ProjectSkills, Projects.id == ProjectSkills.project_id).outerjoin(Skills, ProjectSkills.skill_id == Skills.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"project":project, "skills": skill}

class Project(BaseModel):
    name: str = Form(...)
    description: str = Form(...)
    image: UploadFile = File(...)
    demo_link: str = Form(...)
    github_link: str = Form(...)
    skills: list[int] = Form(...)



@projectRouter.post("/")
async def create_project(project: Annotated[Project, Form()], db: Session = Depends(get_db)):

    ext = os.path.splitext(project.image.filename)[-1]
    filename = f"{uuid4().hex}{ext}"
    filepath = os.path.join("images", filename)

    with open(filepath, "wb") as f:
        f.write(await project.image.read())

    project = Projects(
            name=project.name,
            description=project.description,
            image=filepath,
            demo_link=project.demo_link,
            github_link=project.github_link,
        )
    db.add(project)
    db.commit()
    db.refresh(project)

    for skill_id in project.skills:
        project_skill = ProjectSkills(
            project_id=project.id,
            skill_id=skill_id
        )
        db.add(project_skill)
    db.commit()
    skill_names = db.query(Skills.name).filter(Skills.id.in_(project.skills)).all()
    return {"project": project, "skills": skill_names}

@projectRouter.put("/{project_id}")
async def update_project(project_id: int, project: Annotated[Project, Form()], db: Session = Depends(get_db)):
    db_project = db.query(Projects).filter(Projects.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if db_project.image and os.path.exists(db_project.image):
        try:
            os.remove(db_project.image)
        except OSError as e:
            # Log the error but continue with the update
            print(f"Error deleting old image file: {e}")

    ext = os.path.splitext(project.image.filename)[-1]
    filename = f"{uuid4().hex}{ext}"
    filepath = os.path.join("images", filename)

    with open(filepath, "wb") as f:
        f.write(await project.image.read())

    db_project.name = project.name
    db_project.description = project.description
    db_project.image = filepath
    db_project.demo_link = project.demo_link
    db_project.github_link = project.github_link

    db.commit()
    db.refresh(db_project)
    return db_project

@projectRouter.delete("/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db)):
    db_project = db.query(Projects).filter(Projects.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if db_project.image and os.path.exists(db_project.image):
        try:
            os.remove(db_project.image)
        except OSError as e:
            # Log the error but continue with the update
            print(f"Error deleting old image file: {e}")

    db.delete(db_project)
    db.commit()
    return {"message": "Project deleted successfully"}


class ProjectSkill(BaseModel):
    project_id: int
    skill_id: int


@projectRouter.delete("/skill")
def detach_skill(skill_id: int, db: Session = Depends(get_db)):
    attached_skill = db.query(ProjectSkills).filter(ProjectSkills.skill_id == skill_id).first()
    if not attached_skill:
        raise HTTPException(status_code=404, detail="Skill not attached")
    db.delete(attached_skill)
    db.commit()
    return {"message": "Skill detached successfully"}