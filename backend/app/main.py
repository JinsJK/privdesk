import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from app.api.routes import auth, users, tickets, admin, messages
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.base import Base

# Configure logging
logging.basicConfig(level=logging.INFO)
logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

app = FastAPI(
    title="PrivDesk - Support API",
    version="0.1.0",
    servers=[
        {"url": "https://privdesk-app.fly.dev", "description": "Fly Production"},
    ]
)

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    from app.scripts.create_admin import create_admin
    create_admin(SessionLocal())

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://privdesk-frontend.fly.dev",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse(url="/docs")

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(tickets.router, prefix="/tickets", tags=["tickets"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])
app.include_router(messages.router, prefix="/messages", tags=["messages"])
