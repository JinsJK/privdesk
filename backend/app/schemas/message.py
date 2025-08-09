from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MessageCreate(BaseModel):
    content: str

class MessageResponse(BaseModel):
    id: int
    content: str
    created_at: datetime
    sender_id: int
    is_admin: bool
    user_email: Optional[str] = None  # ← add this

    class Config:
        orm_mode = True
