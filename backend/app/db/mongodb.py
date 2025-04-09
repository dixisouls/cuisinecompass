from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings


class MongoDB:
    client: AsyncIOMotorClient = None
    db = None


db = MongoDB()


async def get_database():
    return db.db


async def connect_to_mongo():
    db.client = AsyncIOMotorClient(settings.MONGODB_URL)
    db.db = db.client[settings.MONGODB_DB_NAME]

    # Create collections if they don't exist
    if "users" not in await db.db.list_collection_names():
        await db.db.create_collection("users")
        await db.db.users.create_index("email", unique=True)

    if "meal_plans" not in await db.db.list_collection_names():
        await db.db.create_collection("meal_plans")
        await db.db.meal_plans.create_index([("user_id", 1), ("date", 1)])

    print("Connected to MongoDB")


async def close_mongo_connection():
    if db.client:
        db.client.close()
        print("Closed MongoDB connection")
