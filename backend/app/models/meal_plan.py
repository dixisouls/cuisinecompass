from datetime import datetime, date, timedelta
from bson import ObjectId
from app.database import meal_plans_collection
from typing import List, Dict


class MealPlanModel:
    @staticmethod
    def create(user_id: str, meal_plan_data: Dict, days: int):
        """
        Create a new meal plan for a user
        """
        # Initialize dates starting from today
        today = date.today()
        dates = {}
        for i in range(1, days + 1):
            day_key = f"Day{i}"
            dates[day_key] = today + timedelta(days=i - 1)

        # Create the meal plan document
        meal_plan = {
            "user_id": ObjectId(user_id),
            "days": meal_plan_data,
            "dates": {k: v.isoformat() for k, v in dates.items()},
            "created_at": datetime.now(),
        }

        result = meal_plans_collection.insert_one(meal_plan)
        meal_plan["_id"] = result.inserted_id
        return meal_plan

    @staticmethod
    def get_by_user(user_id: str):
        """
        Get all meal plans for a user
        """
        cursor = meal_plans_collection.find({"user_id": ObjectId(user_id)})
        return list(cursor)

    @staticmethod
    def mark_day_complete(user_id: str, date_str: str):
        """
        Mark a specific day as complete by removing it
        """
        # Find the meal plan that contains this date
        meal_plan = meal_plans_collection.find_one(
            {"user_id": ObjectId(user_id), f"dates.Day1": date_str}
        )

        if not meal_plan:
            return False

        # Find the day key that has this date
        day_key = None
        for key, value in meal_plan["dates"].items():
            if value == date_str:
                day_key = key
                break

        if not day_key:
            return False

        # Remove this day from days and dates
        result = meal_plans_collection.update_one(
            {"_id": meal_plan["_id"]},
            {"$unset": {f"days.{day_key}": "", f"dates.{day_key}": ""}},
        )

        return result.modified_count > 0

    @staticmethod
    def count_planned_days(user_id: str):
        """
        Count how many days are currently planned for a user
        """
        pipeline = [
            {"$match": {"user_id": ObjectId(user_id)}},
            {"$project": {"dates": {"$objectToArray": "$dates"}}},
            {"$unwind": "$dates"},
            {"$count": "total_days"},
        ]

        result = list(meal_plans_collection.aggregate(pipeline))
        return result[0]["total_days"] if result else 0

    @staticmethod
    def get_latest_date(user_id: str):
        """
        Get the latest date in the meal plan
        """
        pipeline = [
            {"$match": {"user_id": ObjectId(user_id)}},
            {"$project": {"dates": {"$objectToArray": "$dates"}}},
            {"$unwind": "$dates"},
            {"$sort": {"dates.v": -1}},
            {"$limit": 1},
            {"$project": {"latest_date": "$dates.v"}},
        ]

        result = list(meal_plans_collection.aggregate(pipeline))
        return (
            datetime.fromisoformat(result[0]["latest_date"]).date() if result else None
        )
