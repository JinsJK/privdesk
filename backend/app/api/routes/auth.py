# backend/app/api/routes/auth.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.hash import bcrypt
from app.schemas.user import UserCreate, UserLogin
from app.models.user import User
from app.core.security import create_access_token
from app.api.deps import get_db
from datetime import timedelta
from app.core.config import settings 

router = APIRouter()

@router.post("/register")
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user_in.email).first():
        raise HTTPException(status_code=400, detail="Email already registered. Please Sign In.")
    hashed = bcrypt.hash(user_in.password)
    user = User(email=user_in.email, hashed_password=hashed, consent=user_in.consent)
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"msg": "User registered"}

@router.post("/login")
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not bcrypt.verify(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    #set token expiry duration
    expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(data={
        "sub": user.email,
        "is_admin": user.is_admin
    }, expires_delta=expires)
    return {"access_token": token, "token_type": "bearer"}