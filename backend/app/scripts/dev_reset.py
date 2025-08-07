# backend\app\scripts\dev_reset.py
from app.db.session import SessionLocal
from app.models.user import User
from app.models.ticket import Ticket
from app.models.message import Message

def reset_database():
    db = SessionLocal()
    try:
        #  First delete messages
        deleted_messages = db.query(Message).delete()

        #  Then delete tickets
        deleted_tickets = db.query(Ticket).delete()

        #  Then delete non-admin users
        deleted_users = db.query(User).filter(User.is_admin == False).delete()

        db.commit()

        print(f"✅ Deleted {deleted_messages} messages, {deleted_tickets} tickets, and {deleted_users} non-admin users.")
    except Exception as e:
        db.rollback()
        print(f"❌ Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    reset_database()
