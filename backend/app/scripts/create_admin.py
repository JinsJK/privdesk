# backend/app/scripts/create_admin.py
from app.db.session import SessionLocal
from app.models.user import User
from passlib.hash import bcrypt

def create_admin():
    db = SessionLocal()

    admin_email = "jinsisnear@gmail.com"
    admin_password = "admin1234"

    existing_user = db.query(User).filter(User.email == admin_email).first()
    if existing_user:
        print("Admin user already exists.")
        return

    admin = User(
        email=admin_email,
        hashed_password=bcrypt.hash(admin_password),
        is_admin=True,
        consent=True
    )
    db.add(admin)
    db.commit()
    print("Admin user created.")

if __name__ == "__main__":
    create_admin()
