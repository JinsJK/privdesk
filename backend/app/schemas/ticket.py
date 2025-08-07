# backend\app\schemas\ticket.py
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class TicketBase(BaseModel):
    title: str = Field(..., min_length=1)
    description: str = Field(..., min_length=1)

class TicketCreate(TicketBase):
    pass

class TicketUser(BaseModel):
    email: str

    class Config:
        orm_mode = True

class TicketResponse(TicketBase):
    id: int
    status: str
    created_at: datetime
    user: Optional[TicketUser]  # include user email

    class Config:
        orm_mode = True
