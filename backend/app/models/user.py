from datetime import datetime
from bson import ObjectId
from app.database import users_collection
from app.models.schema import UserCreate, UserProfile, UserProfileUpdate


class UserModel:
    @staticmethod
    def create(user_data: UserCreate, hashed_password: str):
        user_dict = user_data.dict()
        user_dict.pop("password")

        # Create default profile
        profile = UserProfile().dict()

        new_user = {
            "email": user_dict["email"],
            "first_name": user_dict["first_name"],
            "last_name": user_dict["last_name"],
            "hashed_password": hashed_password,
            "profile": profile,
            "created_at": datetime.now(),
        }

        result = users_collection.insert_one(new_user)
        new_user["_id"] = result.inserted_id
        return new_user

    @staticmethod
    def get_by_email(email: str):
        return users_collection.find_one({"email": email})

    @staticmethod
    def get_by_id(user_id: str):
        return users_collection.find_one({"_id": ObjectId(user_id)})

    @staticmethod
    def update_profile(user_id: str, profile_data: UserProfileUpdate):
        update_data = {k: v for k, v in profile_data.dict().items() if v is not None}

        result = users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {f"profile.{k}": v for k, v in update_data.items()}},
        )

        return result.modified_count > 0

    @staticmethod
    def update_password(user_id: str, hashed_password: str):
        result = users_collection.update_one(
            {"_id": ObjectId(user_id)}, {"$set": {"hashed_password": hashed_password}}
        )

        return result.modified_count > 0
