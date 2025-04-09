from fastapi import APIRouter, Depends, HTTPException, status
from typing import Any
from bson import ObjectId
from datetime import datetime

from app.api.dependencies import get_current_user
from app.db.mongodb import get_database
from app.models.models import UserUpdate, ChangePassword
from app.core.security import get_password_hash, verify_password

router = APIRouter()


@router.put("/me", response_model=dict)
async def update_user(
    user_in: UserUpdate,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database),
) -> Any:
    """
    Update user information
    """
    # Update user data
    update_data = {
        k: v for k, v in user_in.dict(exclude_unset=True).items() if v is not None
    }

    if update_data:
        update_data["updated_at"] = datetime.utcnow()

        # Update in database
        await db.users.update_one(
            {"_id": ObjectId(current_user["_id"])}, {"$set": update_data}
        )

    # Return updated user
    updated_user = await db.users.find_one({"_id": ObjectId(current_user["_id"])})

    # Convert ObjectId to string
    user_data = dict(updated_user)
    user_data["_id"] = str(user_data["_id"])

    # Remove sensitive information
    user_data.pop("hashed_password", None)

    return user_data


@router.post("/change-password", response_model=dict)
async def change_password(
    password_data: ChangePassword,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database),
) -> Any:
    """
    Change user password
    """
    # Verify old password
    if not verify_password(password_data.old_password, current_user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect password",
        )

    # Update password
    hashed_password = get_password_hash(password_data.new_password)
    await db.users.update_one(
        {"_id": ObjectId(current_user["_id"])},
        {"$set": {"hashed_password": hashed_password, "updated_at": datetime.utcnow()}},
    )

    return {"message": "Password updated successfully"}


@router.post("/dietary-restrictions", response_model=dict)
async def update_dietary_restrictions(
    restrictions: list,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database),
) -> Any:
    """
    Update user dietary restrictions
    """
    await db.users.update_one(
        {"_id": ObjectId(current_user["_id"])},
        {
            "$set": {
                "dietary_restrictions": restrictions,
                "updated_at": datetime.utcnow(),
            }
        },
    )

    return {"message": "Dietary restrictions updated successfully"}


@router.post("/allergies", response_model=dict)
async def update_allergies(
    allergies: list,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database),
) -> Any:
    """
    Update user allergies
    """
    await db.users.update_one(
        {"_id": ObjectId(current_user["_id"])},
        {"$set": {"allergies": allergies, "updated_at": datetime.utcnow()}},
    )

    return {"message": "Allergies updated successfully"}


@router.post("/disliked-ingredients", response_model=dict)
async def update_disliked_ingredients(
    ingredients: list,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database),
) -> Any:
    """
    Update user disliked ingredients
    """
    await db.users.update_one(
        {"_id": ObjectId(current_user["_id"])},
        {
            "$set": {
                "disliked_ingredients": ingredients,
                "updated_at": datetime.utcnow(),
            }
        },
    )

    return {"message": "Disliked ingredients updated successfully"}


@router.post("/preferred-cuisines", response_model=dict)
async def update_preferred_cuisines(
    cuisines: list,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database),
) -> Any:
    """
    Update user preferred cuisines
    """
    await db.users.update_one(
        {"_id": ObjectId(current_user["_id"])},
        {"$set": {"preferred_cuisines": cuisines, "updated_at": datetime.utcnow()}},
    )

    return {"message": "Preferred cuisines updated successfully"}


@router.post("/goals", response_model=dict)
async def update_goals(
    goals: dict,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database),
) -> Any:
    """
    Update user goals (calories and macros)
    """
    update_data = {}

    if "target_daily_calories" in goals:
        update_data["target_daily_calories"] = goals["target_daily_calories"]

    if "target_macros_pct" in goals:
        update_data["target_macros_pct"] = goals["target_macros_pct"]

    if update_data:
        update_data["updated_at"] = datetime.utcnow()

        await db.users.update_one(
            {"_id": ObjectId(current_user["_id"])}, {"$set": update_data}
        )

    return {"message": "Goals updated successfully"}
