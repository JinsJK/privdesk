# backend/app/scripts/create_admin.py
import os
from app.models.user import User
from passlib.hash import bcrypt


def create_admin(db):
    admin_email = os.getenv("ADMIN_EMAIL", "adminuser@gmail.com")
    admin_password = os.getenv("ADMIN_PASSWORD", "admin1234")

    existing_user = db.query(User).filter(User.email == admin_email).first()
    if existing_user:
        print("✅ Admin already exists.")
        return

    admin = User(
        email=admin_email,
        hashed_password=bcrypt.hash(admin_password),
        is_admin=True,
        consent=True,
    )
    db.add(admin)
    db.commit()
    print(f"✅ Admin '{admin_email}' created.")


# Optional: Run from command line
if __name__ == "__main__":
    from app.db.session import SessionLocal
    db = SessionLocal()
    create_admin(db)
    db.close()
