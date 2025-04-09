from fastapi import APIRouter, Depends, HTTPException, status
from typing import Any, Dict
from bson import ObjectId
from datetime import datetime, date, timedelta

from app.api.dependencies import get_current_user
from app.db.mongodb import get_database

router = APIRouter()


@router.get("/stats", response_model=Dict[str, Any])
async def get_dashboard_stats(
    current_user: dict = Depends(get_current_user), db=Depends(get_database)
) -> Any:
    """
    Get dashboard statistics including today's and weekly meal plans
    """
    # Get today's stats and weekly stats (Monday to Sunday)
    today = date.today()
    start_of_week = today - timedelta(days=today.weekday())
    end_of_week = start_of_week + timedelta(days=6)

    # Get meal plans for today
    today_plan = await db.meal_plans.find_one(
        {"user_id": ObjectId(current_user["_id"]), "date": today, "is_done": False}
    )

    # Format today's plan for response
    today_plan_formatted = None
    if today_plan:
        today_plan_formatted = dict(today_plan)
        today_plan_formatted["_id"] = str(today_plan_formatted["_id"])
        today_plan_formatted["user_id"] = str(today_plan_formatted["user_id"])
        today_plan_formatted["date"] = today_plan_formatted["date"].isoformat()
        today_plan_formatted["created_at"] = today_plan_formatted[
            "created_at"
        ].isoformat()

    # Get meal plans for this week
    cursor = db.meal_plans.find(
        {
            "user_id": ObjectId(current_user["_id"]),
            "date": {"$gte": start_of_week, "$lte": end_of_week},
            "is_done": False,
        }
    ).sort("date", 1)

    week_plans = []
    async for plan in cursor:
        plan_formatted = dict(plan)
        plan_formatted["_id"] = str(plan_formatted["_id"])
        plan_formatted["user_id"] = str(plan_formatted["user_id"])
        plan_formatted["date"] = plan_formatted["date"].isoformat()
        plan_formatted["created_at"] = plan_formatted["created_at"].isoformat()
        week_plans.append(plan_formatted)

    # In a real application, you would calculate calories and macros
    # For this example, we're just returning the meal plans

    return {
        "today": {"date": today.isoformat(), "plan": today_plan_formatted},
        "week": {
            "start_date": start_of_week.isoformat(),
            "end_date": end_of_week.isoformat(),
            "plans": week_plans,
        },
        "user_goals": {
            "target_daily_calories": current_user.get("target_daily_calories", 2000),
            "target_macros_pct": current_user.get(
                "target_macros_pct", {"protein": 20, "carbs": 50, "fat": 30}
            ),
        },
    }
