from fastapi import APIRouter, Depends, HTTPException, status
from app.models.schema import UserProfileUpdate, GoalsUpdate
from app.models.user import UserModel
from app.services.auth_service import get_current_user
from bson import json_util
import json

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", status_code=status.HTTP_200_OK)
async def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    """
    Get current user's profile information
    """
    # Parse the MongoDB document to JSON
    user_json = json.loads(json_util.dumps(current_user))

    # Convert ObjectId to string
    user_json["id"] = str(user_json["_id"]["$oid"])
    del user_json["_id"]

    return user_json


@router.put("/profile", status_code=status.HTTP_200_OK)
async def update_profile(
    profile_data: UserProfileUpdate, current_user: dict = Depends(get_current_user)
):
    """
    Update user profile information
    """
    success = UserModel.update_profile(str(current_user["_id"]), profile_data)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update profile",
        )

    return {"message": "Profile updated successfully"}


@router.put("/profile/dietary-restrictions", status_code=status.HTTP_200_OK)
async def update_dietary_restrictions(
    restrictions: list[str], current_user: dict = Depends(get_current_user)
):
    """
    Update dietary restrictions
    """
    profile_data = UserProfileUpdate(dietary_restrictions=restrictions)
    success = UserModel.update_profile(str(current_user["_id"]), profile_data)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update dietary restrictions",
        )

    return {"message": "Dietary restrictions updated successfully"}


@router.put("/profile/allergies", status_code=status.HTTP_200_OK)
async def update_allergies(
    allergies: list[str], current_user: dict = Depends(get_current_user)
):
    """
    Update allergies
    """
    profile_data = UserProfileUpdate(allergies=allergies)
    success = UserModel.update_profile(str(current_user["_id"]), profile_data)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update allergies",
        )

    return {"message": "Allergies updated successfully"}


@router.put("/profile/disliked-ingredients", status_code=status.HTTP_200_OK)
async def update_disliked_ingredients(
    ingredients: list[str], current_user: dict = Depends(get_current_user)
):
    """
    Update disliked ingredients
    """
    profile_data = UserProfileUpdate(disliked_ingredients=ingredients)
    success = UserModel.update_profile(str(current_user["_id"]), profile_data)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update disliked ingredients",
        )

    return {"message": "Disliked ingredients updated successfully"}


@router.put("/profile/preferred-cuisines", status_code=status.HTTP_200_OK)
async def update_preferred_cuisines(
    cuisines: list[str], current_user: dict = Depends(get_current_user)
):
    """
    Update preferred cuisines
    """
    profile_data = UserProfileUpdate(preferred_cuisines=cuisines)
    success = UserModel.update_profile(str(current_user["_id"]), profile_data)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update preferred cuisines",
        )

    return {"message": "Preferred cuisines updated successfully"}


@router.put("/profile/goals", status_code=status.HTTP_200_OK)
async def update_goals(
    goals_data: GoalsUpdate, current_user: dict = Depends(get_current_user)
):
    """
    Update nutrition goals
    """
    profile_data = UserProfileUpdate(
        target_daily_calories=goals_data.target_daily_calories,
        target_macros_pct=goals_data.target_macros_pct
    )
    success = UserModel.update_profile(str(current_user["_id"]), profile_data)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update goals",
        )

    return {"message": "Goals updated successfully"}