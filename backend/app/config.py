import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB settings
MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("DB_NAME", "cuisinecompass")

# Security settings
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# Gemini API settings
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
