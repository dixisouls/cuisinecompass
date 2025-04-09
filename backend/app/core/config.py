import os
from pydantic import BaseSettings
from typing import Optional, Dict, Any, List


class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Calorie Tracker and Recipe Generator"
    API_V1_STR: str = "/api/v1"

    # MongoDB settings
    MONGODB_URL: str = (
        "mongodb+srv://Admin:Admin_2025@cuisinecompass.iognj1k.mongodb.net/?retryWrites=true&w=majority&appName=CuisineCompass"
    )
    MONGODB_DB_NAME: str = "cuisine_compass"

    # JWT settings
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 1 week

    # Gemini API settings
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY")

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
