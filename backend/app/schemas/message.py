# backend\app\schemas\message.py
from pydantic import BaseModel
from datetime import datetime

class MessageCreate(BaseModel):
    content: str

class MessageResponse(BaseModel):
    id: int
    content: str
    created_at: datetime
    sender_id: int
    is_admin: bool

    class Config:
        orm_mode = True
