from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from app.config import MONGODB_URI, DB_NAME

client = MongoClient(MONGODB_URI, server_api=ServerApi("1"))
db = client[DB_NAME]

# Define collections
users_collection = db["users"]
meal_plans_collection = db["meal_plans"]

# Create indexes for better query performance
users_collection.create_index("email", unique=True)
meal_plans_collection.create_index([("user_id", 1), ("date", 1)])


def get_db():
    try:
        # Verify connection to MongoDB
        client.admin.command("ping")
        return db
    except Exception as e:
        print(f"Database connection error: {e}")
        raise
