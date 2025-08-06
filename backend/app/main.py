from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import auth, users, tickets, admin, messages
from fastapi.responses import RedirectResponse
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.base import Base

# Read DB URL from environment variable (works in Fly + local)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")  # fallback if local

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Initialize app
app = FastAPI(
    title="PrivDesk - Support API",
    version="0.1.0",
    servers=[  # you can keep this
        {"url": "https://privdesk-app.fly.dev", "description": "Fly Production"},
    ]
)


# Safe startup logic inside event handler
@app.on_event("startup")
def startup():
    # Create tables (only if no Alembic)
    Base.metadata.create_all(bind=engine)

    # Create admin user once
    from app.scripts.create_admin import create_admin
    create_admin(SessionLocal())  # pass DB session


# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",              # local dev
        "https://privdesk.vercel.app",        # your Vercel frontend domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse(url="/docs")

# Routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(tickets.router, prefix="/tickets", tags=["tickets"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])
app.include_router(messages.router, prefix="/messages", tags=["messages"])
