from fastapi import APIRouter
from app.api.endpoints import auth, users, recipes, dashboard

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(recipes.router, prefix="/recipes", tags=["recipes"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
