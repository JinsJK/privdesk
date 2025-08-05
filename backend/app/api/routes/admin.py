from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.ticket import Ticket
from sqlalchemy import func

router = APIRouter()

@router.get("/stats")
def get_admin_stats(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Admins only")

    total_users = db.query(func.count(User.id)).scalar()
    total_admins = db.query(func.count(User.id)).filter(User.is_admin == True).scalar()
    total_tickets = db.query(func.count(Ticket.id)).scalar()

    ticket_statuses = dict(
        db.query(Ticket.status, func.count(Ticket.id)).group_by(Ticket.status).all()
    )

    return {
        "total_users": total_users,
        "total_admins": total_admins,
        "total_tickets": total_tickets,
        "ticket_statuses": ticket_statuses
    }
