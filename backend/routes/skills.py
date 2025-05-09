import os
from typing import Annotated
from uuid import uuid4
from fastapi import APIRouter, Depends, Form, File, HTTPException, UploadFile
from pydantic import BaseModel
from sqlalchemy.orm import Session
from db import get_db

from models import ProjectSkills, Projects, Skills

skillRouter = APIRouter()
@skillRouter.get("/")
def get_details(db: Session = Depends(get_db)):
    skills = db.query(Skills).all()
    details = {"skills": skills}

    return details


@skillRouter.get("/{skill_id}")
def get_project(skill_id: int, db: Session = Depends(get_db)):
    skill = db.query(Skills).filter(Skills.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    return skill

class SkillClass(BaseModel):
    name: str
    rating: int



@skillRouter.post("/")
async def create_skill(skill: SkillClass, db: Session = Depends(get_db)):

    new_skill = Skills(
            name=skill.name,
            rating=skill.rating
        )
    db.add(new_skill)
    db.commit()
    db.refresh(new_skill)
    return new_skill

@skillRouter.put("/{skill_id}")
async def update_project(skill_id: int, skill: SkillClass, db: Session = Depends(get_db)):
    db_skill = db.query(Skills).filter(Skills.id == skill_id).first()
    if not db_skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    db_skill.name = skill.name
    db_skill.rating = skill.rating

    db.commit()
    db.refresh(db_skill)
    return db_skill

@skillRouter.delete("/{skill_id}")
def delete_project(skill_id: int, db: Session = Depends(get_db)):
    attached_skill = db.query(ProjectSkills).filter(ProjectSkills.skill_id == skill_id).first()
    if attached_skill:
        raise HTTPException(status_code=400, detail="Skill is attached to a project")
    db_skill = db.query(Skills).filter(Skills.id == skill_id).first()
    if not db_skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    db.delete(db_skill)
    db.commit()
    return {"message": "Skill deleted successfully"}