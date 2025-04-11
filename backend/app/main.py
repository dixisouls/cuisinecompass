from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, user, meal_plan
from app.database import get_db
from app.limiter import limiter
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

# Initialize FastAPI app
app = FastAPI(
    title="Cuisine Compass API",
    description="API for calorie tracking and meal planning",
    version="1.0.0",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(meal_plan.router)


@app.get("/")
async def root():
    """
    Root endpoint to verify API is running
    """
    return {"message": "Welcome to Cuisine Compass API"}


@app.get("/health")
async def health_check():
    """
    Health check endpoint to verify database connection
    """
    try:
        db = get_db()
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": str(e)}


# Main entry point
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
