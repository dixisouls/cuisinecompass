from fastapi import APIRouter, Depends, HTTPException, status
from app.models.schema import MealPlanRequest, MealPlanComplete
from app.services.auth_service import get_current_user
from app.services.meal_plan_service import MealPlanService
from bson import json_util
import json

router = APIRouter(prefix="/meal-plans", tags=["meal plans"])


@router.post("/generate", status_code=status.HTTP_201_CREATED)
async def generate_meal_plan(
    request: MealPlanRequest, current_user: dict = Depends(get_current_user)
):
    """
    Generate a meal plan for specified number of days
    """
    try:
        meal_plan = MealPlanService.generate_meal_plan(
            str(current_user["_id"]), current_user["profile"], request.days
        )

        # Parse the MongoDB document to JSON
        meal_plan_json = json.loads(json_util.dumps(meal_plan))

        # Convert ObjectId to string
        meal_plan_json["id"] = str(meal_plan_json["_id"]["$oid"])
        meal_plan_json["user_id"] = str(meal_plan_json["user_id"]["$oid"])
        del meal_plan_json["_id"]

        return meal_plan_json
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate meal plan: {str(e)}",
        )


@router.get("/", status_code=status.HTTP_200_OK)
async def get_meal_plans(current_user: dict = Depends(get_current_user)):
    """
    Get all meal plans for the current user
    """
    meal_plans = MealPlanService.get_user_meal_plans(str(current_user["_id"]))

    # Parse the MongoDB documents to JSON
    meal_plans_json = json.loads(json_util.dumps(meal_plans))

    # Convert ObjectId to string for each meal plan
    for plan in meal_plans_json:
        plan["id"] = str(plan["_id"]["$oid"])
        plan["user_id"] = str(plan["user_id"]["$oid"])
        del plan["_id"]

    return meal_plans_json


@router.post("/complete", status_code=status.HTTP_200_OK)
async def mark_day_complete(
    request: MealPlanComplete, current_user: dict = Depends(get_current_user)
):
    """
    Mark a day's meal plan as complete
    """
    success = MealPlanService.mark_day_complete(str(current_user["_id"]), request.date)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meal plan for specified date not found",
        )

    return {"message": "Day marked as complete"}


@router.post("/generate-ahead", status_code=status.HTTP_201_CREATED)
async def generate_ahead(current_user: dict = Depends(get_current_user)):
    """
    Generate meal plans for remaining days (up to max 7 days total)
    """
    try:
        meal_plan = MealPlanService.generate_ahead(
            str(current_user["_id"]), current_user["profile"]
        )

        if not meal_plan:
            return {"message": "No additional days to generate"}

        # Parse the MongoDB document to JSON
        meal_plan_json = json.loads(json_util.dumps(meal_plan))

        # Convert ObjectId to string
        meal_plan_json["id"] = str(meal_plan_json["_id"]["$oid"])
        meal_plan_json["user_id"] = str(meal_plan_json["user_id"]["$oid"])
        del meal_plan_json["_id"]

        return meal_plan_json
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate meal plan: {str(e)}",
        )
