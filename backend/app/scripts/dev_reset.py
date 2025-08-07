from app.models.user import User
from app.models.ticket import Ticket
from app.db.session import SessionLocal

def reset_database():
    db = SessionLocal()
    try:
        deleted_tickets = db.query(Ticket).delete()
        deleted_users = db.query(User).filter(User.is_admin == False).delete()
        db.commit()
        print(f"✅ Deleted {deleted_tickets} tickets and {deleted_users} non-admin users.")
    except Exception as e:
        db.rollback()
        print(f"❌ Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    reset_database()
