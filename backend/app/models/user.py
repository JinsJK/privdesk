# backend/app/models/user.py 
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user")  # or "admin"
    consent = Column(Boolean, default=False)
    is_admin = Column(Boolean, default=False) 
    created_at = Column(DateTime(timezone=True), server_default=func.now())
