from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from typing import Any
from bson import ObjectId
from datetime import datetime

from app.core.security import create_access_token, verify_password, get_password_hash
from app.core.config import settings
from app.db.mongodb import get_database
from app.models.models import UserCreate, User, Token
from app.api.dependencies import get_current_user

router = APIRouter()


@router.post("/register", response_model=dict)
async def register(user_in: UserCreate, db=Depends(get_database)) -> Any:
    """
    Register a new user
    """
    # Check if user with given email already exists
    existing_user = await db.users.find_one({"email": user_in.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists",
        )

    # Create new user
    hashed_password = get_password_hash(user_in.password)
    current_time = datetime.utcnow()

    user_data = user_in.dict(exclude={"password"})
    user_data.update(
        {
            "hashed_password": hashed_password,
            "created_at": current_time,
            "updated_at": current_time,
        }
    )

    result = await db.users.insert_one(user_data)

    # Return success message
    return {"message": "User created successfully", "user_id": str(result.inserted_id)}


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db=Depends(get_database)
) -> Any:
    """
    Get access token for user authentication
    """
    # Find user by email
    user = await db.users.find_one({"email": form_data.username})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Verify password
    if not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=str(user["_id"]), expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.get("/me", response_model=dict)
async def get_current_user_info(current_user=Depends(get_current_user)):
    """
    Get information about the current authenticated user
    """
    # Convert ObjectId to string
    user_data = dict(current_user)
    user_data["_id"] = str(user_data["_id"])

    # Remove sensitive information
    user_data.pop("hashed_password", None)

    return user_data
