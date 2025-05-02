from db import Base
from sqlalchemy import Column, Integer, String

class Projects(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    image = Column(String)
    demo_link = Column(String)
    github_link = Column(String)

class Skills(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    rating = Column(Integer)

class ProjectSkills(Base):
    __tablename__ = "project_skills"
    project_id = Column(Integer, primary_key=True)
    skill_id = Column(Integer, primary_key=True)


class Chat(Base):
    __tablename__ = "chat"

    id = Column(Integer, primary_key=True, index=True)
    chat = Column(String)