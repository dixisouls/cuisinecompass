from datetime import datetime, date, timedelta
from bson import ObjectId
from app.database import meal_plans_collection
from typing import List, Dict


class MealPlanModel:
    @staticmethod
    def create(user_id: str, meal_plan_data: Dict, days: int, start_date=None):
        """
        Create a new meal plan for a user
        
        Parameters:
        - user_id: User ID to create the plan for
        - meal_plan_data: The meal plan data from the Gemini API
        - days: Number of days to generate
        - start_date: The starting date for the meal plan (defaults to today if None)
        """
        # Use provided start_date or default to today
        if start_date is None:
            start_date = date.today()
        
        # Create date mappings for each day, starting from start_date
        dates = {}
        for i in range(days):
            day_key = f"Day{i+1}"  # Day1, Day2, etc.
            day_date = start_date + timedelta(days=i)
            dates[day_key] = day_date.isoformat()  # Store as ISO format string

        # Create the meal plan document
        meal_plan = {
            "user_id": ObjectId(user_id),
            "days": meal_plan_data,
            "dates": dates,
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
        # Find all meal plans for this user
        meal_plans = meal_plans_collection.find({"user_id": ObjectId(user_id)})
        
        for meal_plan in meal_plans:
            # Find the day key that has this date
            day_key = None
            for key, value in meal_plan.get("dates", {}).items():
                if value == date_str:
                    day_key = key
                    break
            
            if day_key:
                # Remove this day from days and dates
                result = meal_plans_collection.update_one(
                    {"_id": meal_plan["_id"]},
                    {"$unset": {f"days.{day_key}": "", f"dates.{day_key}": ""}},
                )
                if result.modified_count > 0:
                    return True
                
        return False

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
            date.fromisoformat(result[0]["latest_date"]) if result else None
        )