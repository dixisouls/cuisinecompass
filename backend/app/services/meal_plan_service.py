from datetime import date, timedelta
from typing import Dict
from app.models.meal_plan import MealPlanModel
from app.services.gemini_service import GeminiService


class MealPlanService:
    @staticmethod
    def generate_meal_plan(user_id: str, user_profile: Dict, days: int):
        """
        Generate a meal plan for a user and store it in the database
        """
        # Check how many days are already planned
        current_planned_days = MealPlanModel.count_planned_days(user_id)

        # If already at max capacity, return error
        if current_planned_days >= 7:
            raise ValueError(
                "Maximum meal plan capacity reached (7 days). Mark some days as complete before generating more."
            )

        # If requesting more days than available capacity, adjust days
        if current_planned_days + days > 7:
            days = 7 - current_planned_days

        # Format profile for Gemini API
        gemini_profile = {
            "profile": {
                "days": days,
                "restrictions": user_profile["dietary_restrictions"],
                "allergies": user_profile["allergies"],
            },
            "preferences": {
                "dislikes": user_profile["disliked_ingredients"],
                "preferred_cuisines": user_profile["preferred_cuisines"],
            },
            "goals": {
                "target_daily_calories": user_profile["target_daily_calories"],
                "target_macros_pct": user_profile["target_macros_pct"],
            },
        }

        # Generate meal plan using Gemini API
        meal_plan_data = GeminiService.generate_meal_plan(gemini_profile, days)

        # Get the latest date currently in the plan
        latest_date = MealPlanModel.get_latest_date(user_id)
        
        # Calculate start date - use the day after the latest date if there's a latest date,
        # otherwise start from today
        today = date.today()
        if latest_date:
            # If latest date is in the future, start from the day after
            if latest_date >= today:
                start_date = latest_date + timedelta(days=1)
            else:
                # If latest date is in the past, start from today
                start_date = today
        else:
            start_date = today
        
        # Store in database with calculated start date
        meal_plan = MealPlanModel.create(user_id, meal_plan_data, days, start_date)

        return meal_plan

    @staticmethod
    def get_user_meal_plans(user_id: str):
        """
        Get all meal plans for a user
        """
        return MealPlanModel.get_by_user(user_id)

    @staticmethod
    def mark_day_complete(user_id: str, day_date: date):
        """
        Mark a specific day as complete
        """
        return MealPlanModel.mark_day_complete(user_id, day_date.isoformat())

    @staticmethod
    def generate_ahead(user_id: str, user_profile: Dict):
        """
        Generate meal plans for the remaining available days (up to 7 total)
        Handles batching of requests to avoid API limitations (max 4 days per request)
        """
        # Check current planned days
        current_planned_days = MealPlanModel.count_planned_days(user_id)

        # If already at max capacity, return error
        if current_planned_days >= 7:
            raise ValueError(
                "Maximum meal plan capacity reached (7 days). Mark some days as complete before generating more."
            )

        # Calculate how many more days we can generate
        days_to_generate = 7 - current_planned_days

        # If no days to generate, return
        if days_to_generate <= 0:
            return None

        # Get the latest date currently in the plan
        latest_date = MealPlanModel.get_latest_date(user_id)
        today = date.today()
        
        # Calculate start date
        if latest_date:
            # If latest date is in the future, start from the day after
            if latest_date >= today:
                start_date = latest_date + timedelta(days=1)
            else:
                # If latest date is in the past, start from today
                start_date = today
        else:
            start_date = today

        meal_plans = []
        current_start_date = start_date
        days_left = days_to_generate
        
        while days_left > 0:
            # Generate at most 4 days at a time
            batch_size = min(3, days_left)
            
            print(f"Generating meal plan batch of {batch_size} days starting from {current_start_date}")
            
            # Format profile for Gemini API - requesting batch_size days
            gemini_profile = {
                "profile": {
                    "days": batch_size,
                    "restrictions": user_profile["dietary_restrictions"],
                    "allergies": user_profile["allergies"],
                },
                "preferences": {
                    "dislikes": user_profile["disliked_ingredients"],
                    "preferred_cuisines": user_profile["preferred_cuisines"],
                },
                "goals": {
                    "target_daily_calories": user_profile["target_daily_calories"],
                    "target_macros_pct": user_profile["target_macros_pct"],
                },
            }

            try:
                # Generate meal plan for current batch
                meal_plan_data = GeminiService.generate_meal_plan(gemini_profile, batch_size)
                
                # Store in database
                meal_plan = MealPlanModel.create(
                    user_id, meal_plan_data, batch_size, current_start_date
                )
                
                meal_plans.append(meal_plan)
                
                # Update for next iteration
                days_left -= batch_size
                current_start_date = current_start_date + timedelta(days=batch_size)
                
            except Exception as e:
                # Log error and stop
                print(f"Error generating meal plan batch of {batch_size} days: {e}")
                # If we can't generate this batch, stop here
                break

        # Return the last meal plan created (for API response)
        return meal_plans[-1] if meal_plans else None