from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.api.api import api_router
from app.core.config import settings
from app.db.mongodb import connect_to_mongo, close_mongo_connection

app = FastAPI(
    title=settings.PROJECT_NAME, openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)


# Connect to MongoDB on startup
@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()


# Close MongoDB connection on shutdown
@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
