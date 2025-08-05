# backend/app/api/routes/users.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.user import User
from app.api.deps import get_db, get_current_user
from app.schemas.user import UserOut

router = APIRouter()

@router.get("/me", response_model=UserOut)
def get_profile(user: User = Depends(get_current_user)):
    return user

@router.delete("/me")
def delete_account(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    db.delete(user)
    db.commit()
    return {"msg": "User deleted"}