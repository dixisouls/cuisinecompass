from fastapi import APIRouter, Depends, HTTPException, status, Body
from typing import Any, List, Dict
from bson import ObjectId
from datetime import datetime, date, timedelta

from app.api.dependencies import get_current_user
from app.db.mongodb import get_database
from app.models.models import GenerateMealPlanRequest
from app.services.meal_service import meal_service

router = APIRouter()


@router.post("/generate", response_model=Dict[str, Any])
async def generate_meal_plan(
    request: GenerateMealPlanRequest,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database),
) -> Any:
    """
    Generate a meal plan for the specified number of days
    """
    try:
        # Generate meal plan using Gemini API
        meal_plan_data = await meal_service.generate_meal_plan(
            current_user, request.days
        )

        # Store meal plans in database
        today = date.today()
        stored_plans = []

        for i in range(1, request.days + 1):
            day_key = f"Day{i}"
            if day_key in meal_plan_data:
                meal_date = today + timedelta(days=i - 1)

                plan_data = {
                    "user_id": ObjectId(current_user["_id"]),
                    "date": meal_date,
                    "is_done": False,
                    "breakfast": meal_plan_data[day_key]["Breakfast"],
                    "lunch": meal_plan_data[day_key]["Lunch"],
                    "dinner": meal_plan_data[day_key]["Dinner"],
                    "created_at": datetime.utcnow(),
                }

                result = await db.meal_plans.insert_one(plan_data)

                # Convert to response format with string ID
                plan_response = dict(plan_data)
                plan_response["_id"] = str(result.inserted_id)
                plan_response["user_id"] = str(plan_response["user_id"])
                plan_response["date"] = plan_response["date"].isoformat()
                plan_response["created_at"] = plan_response["created_at"].isoformat()

                stored_plans.append(plan_response)

        return {"meal_plans": stored_plans}

    except Exception as e:
        print(f"Error generating meal plan: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate meal plan: {str(e)}",
        )


@router.get("/plans", response_model=Dict[str, Any])
async def get_meal_plans(
    current_user: dict = Depends(get_current_user), db=Depends(get_database)
) -> Any:
    """
    Get all active meal plans for the current user
    """
    # Get all non-completed meal plans for the user
    cursor = db.meal_plans.find(
        {"user_id": ObjectId(current_user["_id"]), "is_done": False}
    ).sort("date", 1)

    meal_plans = []
    async for plan in cursor:
        # Convert to response format
        plan_response = dict(plan)
        plan_response["_id"] = str(plan_response["_id"])
        plan_response["user_id"] = str(plan_response["user_id"])
        plan_response["date"] = plan_response["date"].isoformat()
        plan_response["created_at"] = plan_response["created_at"].isoformat()

        meal_plans.append(plan_response)

    return {"meal_plans": meal_plans}


@router.post("/plans/{plan_id}/done", response_model=Dict[str, str])
async def mark_plan_as_done(
    plan_id: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database),
) -> Any:
    """
    Mark a meal plan as done
    """
    try:
        # Update meal plan status to done
        result = await db.meal_plans.update_one(
            {"_id": ObjectId(plan_id), "user_id": ObjectId(current_user["_id"])},
            {"$set": {"is_done": True}},
        )

        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Meal plan not found or already marked as done",
            )

        return {"message": "Meal plan marked as done"}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error updating meal plan: {str(e)}",
        )


@router.post("/generate-ahead", response_model=Dict[str, Any])
async def generate_ahead(
    current_user: dict = Depends(get_current_user), db=Depends(get_database)
) -> Any:
    """
    Generate additional meal plans to fill up to 7 days
    """
    try:
        # Count existing active meal plans
        count = await db.meal_plans.count_documents(
            {"user_id": ObjectId(current_user["_id"]), "is_done": False}
        )

        # Can have a maximum of 7 days planned
        if count >= 7:
            return {"message": "You already have 7 days of meal plans"}

        # Generate additional days
        days_to_generate = 7 - count

        # Find the last date of existing meal plans
        last_plan = await db.meal_plans.find_one(
            {"user_id": ObjectId(current_user["_id"]), "is_done": False},
            sort=[("date", -1)],
        )

        start_date = date.today()
        if last_plan:
            start_date = last_plan["date"] + timedelta(days=1)

        # Generate new meal plans
        meal_plan_data = await meal_service.generate_meal_plan(
            current_user, days_to_generate
        )

        # Store meal plans in database
        stored_plans = []

        for i in range(1, days_to_generate + 1):
            day_key = f"Day{i}"
            if day_key in meal_plan_data:
                meal_date = start_date + timedelta(days=i - 1)

                plan_data = {
                    "user_id": ObjectId(current_user["_id"]),
                    "date": meal_date,
                    "is_done": False,
                    "breakfast": meal_plan_data[day_key]["Breakfast"],
                    "lunch": meal_plan_data[day_key]["Lunch"],
                    "dinner": meal_plan_data[day_key]["Dinner"],
                    "created_at": datetime.utcnow(),
                }

                result = await db.meal_plans.insert_one(plan_data)

                # Convert to response format
                plan_response = dict(plan_data)
                plan_response["_id"] = str(result.inserted_id)
                plan_response["user_id"] = str(plan_response["user_id"])
                plan_response["date"] = plan_response["date"].isoformat()
                plan_response["created_at"] = plan_response["created_at"].isoformat()

                stored_plans.append(plan_response)

        return {"meal_plans": stored_plans}

    except Exception as e:
        print(f"Error generating additional meal plans: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate additional meal plans: {str(e)}",
        )
