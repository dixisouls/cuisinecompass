from pydantic import BaseModel, EmailStr, Field, validator
from typing import List, Dict, Optional, Union, Any
from datetime import date, datetime
import re


# User-related schemas
class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str


class UserCreate(UserBase):
    password: str

    @validator("password")
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserProfile(BaseModel):
    dietary_restrictions: List[str] = []
    allergies: List[str] = []
    disliked_ingredients: List[str] = []
    preferred_cuisines: List[str] = []
    target_daily_calories: int = 2000
    target_macros_pct: Dict[str, int] = {"protein": 30, "carbs": 40, "fat": 30}


class UserProfileUpdate(BaseModel):
    dietary_restrictions: Optional[List[str]] = None
    allergies: Optional[List[str]] = None
    disliked_ingredients: Optional[List[str]] = None
    preferred_cuisines: Optional[List[str]] = None
    target_daily_calories: Optional[int] = None
    target_macros_pct: Optional[Dict[str, int]] = None


class User(UserBase):
    id: str
    profile: UserProfile
    created_at: datetime

    class Config:
        orm_mode = True


class PasswordChange(BaseModel):
    old_password: str
    new_password: str


# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


# New model for goals update
class GoalsUpdate(BaseModel):
    target_daily_calories: int
    target_macros_pct: Dict[str, int]


# Meal plan schemas
class RecipeIngredient(BaseModel):
    item: str
    quantity: str
    unit: str
    notes: Optional[str] = None


class Recipe(BaseModel):
    description: str
    prepTimeMins: int
    cookTimeMins: int
    ingredients: List[RecipeIngredient]
    instructions: List[str]


class Meal(BaseModel):
    name: str
    recipe: Recipe


class DayMeals(BaseModel):
    Breakfast: Meal
    Lunch: Meal
    Dinner: Meal


class MealPlanRequest(BaseModel):
    days: int = Field(ge=1, le=7)


class MealPlanComplete(BaseModel):
    date: date