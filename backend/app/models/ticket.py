# backend/app/models/ticket.py
from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base
from app.models.user import User

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text)
    status = Column(String, default="open")
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", backref="tickets")
    messages = relationship("Message", back_populates="ticket", order_by="Message.created_at")


    created_at = Column(DateTime, default=datetime.utcnow)
