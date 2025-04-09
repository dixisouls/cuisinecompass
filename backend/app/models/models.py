from pydantic import BaseModel, EmailStr, Field, validator
from typing import List, Dict, Any, Optional
from datetime import datetime, date
from bson import ObjectId


# Custom ObjectId field for Pydantic
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


# User Models
class UserBase(BaseModel):
    email: EmailStr
    fname: str
    lname: str
    dietary_restrictions: List[str] = []
    allergies: List[str] = []
    disliked_ingredients: List[str] = []
    preferred_cuisines: List[str] = []
    target_daily_calories: int = 2000
    target_macros_pct: Dict[str, int] = {"protein": 20, "carbs": 50, "fat": 30}


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    fname: Optional[str] = None
    lname: Optional[str] = None
    dietary_restrictions: Optional[List[str]] = None
    allergies: Optional[List[str]] = None
    disliked_ingredients: Optional[List[str]] = None
    preferred_cuisines: Optional[List[str]] = None
    target_daily_calories: Optional[int] = None
    target_macros_pct: Optional[Dict[str, int]] = None


class UserInDB(UserBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class User(UserBase):
    id: str = Field(alias="_id")
    created_at: datetime
    updated_at: datetime

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class ChangePassword(BaseModel):
    old_password: str
    new_password: str


# Meal Models
class Ingredient(BaseModel):
    item: str
    quantity: str
    unit: str
    notes: Optional[str] = None


class Recipe(BaseModel):
    description: str
    prepTimeMins: int
    cookTimeMins: int
    ingredients: List[Ingredient]
    instructions: List[str]


class Meal(BaseModel):
    name: str
    recipe: Recipe


class MealPlan(BaseModel):
    user_id: str
    date: date
    is_done: bool = False
    breakfast: Meal
    lunch: Meal
    dinner: Meal

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class MealPlanInDB(MealPlan):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class GenerateMealPlanRequest(BaseModel):
    days: int

    @validator("days")
    def validate_days(cls, v):
        if v < 1 or v > 7:
            raise ValueError("Days must be between 1 and 7")
        return v


# Token Models
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenPayload(BaseModel):
    sub: Optional[str] = None
