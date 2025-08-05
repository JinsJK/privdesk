# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import auth, users, tickets
from app.db.session import engine
from app.db.base import Base
from app.api.routes import auth, users, tickets, admin 
from app.api.routes import messages

# Create tables
Base.metadata.create_all(bind=engine)

# Initialize app
app = FastAPI(title="PrivDesk - Support API", version="0.1.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust if frontend origin changes
    allow_credentials=True,
    allow_methods=["*"],  # Or: ["GET", "POST", "OPTIONS"]
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(tickets.router, prefix="/tickets", tags=["tickets"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])
app.include_router(messages.router, prefix="/messages", tags=["messages"])
