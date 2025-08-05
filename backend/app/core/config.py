# backend/app/core/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "PrivDesk"
    JWT_SECRET: str = "supersecret"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    DATABASE_URL: str = "postgresql://privdesk_user:privdesk_pass@db/privdesk_db"

    class Config:
        env_file = ".env"  # loads values from .env file

settings = Settings()
