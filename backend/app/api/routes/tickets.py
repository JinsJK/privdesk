from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session
from typing import List

from app.models.ticket import Ticket
from app.schemas.ticket import TicketCreate, TicketResponse
from app.api.deps import get_db, get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=TicketResponse)
def create_ticket(ticket: TicketCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    new_ticket = Ticket(**ticket.dict(), user_id=user.id)
    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)
    return new_ticket

@router.get("/", response_model=List[TicketResponse])
def get_tickets(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if user.is_admin:
        return db.query(Ticket).all()
    return db.query(Ticket).filter(Ticket.user_id == user.id).all()

@router.patch("/{ticket_id}", response_model=TicketResponse)
def update_ticket_status(
    ticket_id: int = Path(..., gt=0),
    status: str = "open",
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Admins only")

    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    ticket.status = status
    db.commit()
    db.refresh(ticket)
    return ticket

@router.delete("/{ticket_id}")
def delete_ticket(
    ticket_id: int = Path(..., gt=0),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Admins only")

    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    db.delete(ticket)
    db.commit()
    return {"msg": "Ticket deleted"}
