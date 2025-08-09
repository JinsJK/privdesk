# backend/app/api/routes/messages.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app.api.deps import get_current_user, get_db
from app.models.ticket import Ticket
from app.models.message import Message
from app.schemas.message import MessageCreate, MessageResponse
from app.models.user import User
from typing import List

router = APIRouter()

@router.get("/{ticket_id}", response_model=List[MessageResponse])
def get_messages(ticket_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    if not user.is_admin and ticket.user_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    messages = (
        db.query(Message)
        .options(joinedload(Message.sender))  # sender.email
        .filter(Message.ticket_id == ticket_id)
        .order_by(Message.created_at)
        .all()
    )

    return [
        MessageResponse(
            id=m.id,
            content=m.content,
            created_at=m.created_at,
            sender_id=m.sender_id,
            is_admin=bool(m.sender and m.sender.is_admin),
            user_email=(m.sender.email if m.sender else None),  # ← include email
        )
        for m in messages
    ]

@router.post("/{ticket_id}", response_model=MessageResponse)
def post_message(ticket_id: int, msg: MessageCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    if not user.is_admin and ticket.user_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    message = Message(ticket_id=ticket_id, sender_id=user.id, content=msg.content)
    db.add(message)
    db.commit()
    db.refresh(message)

    return MessageResponse(
        id=message.id,
        content=message.content,
        created_at=message.created_at,
        sender_id=message.sender_id,
        is_admin=user.is_admin,
        user_email=user.email,  # ← include email for newly created message
    )
