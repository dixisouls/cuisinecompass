# Cuisine Compass API

FastAPI backend for an AI-powered calorie tracker and recipe generator
application.

## Features

- User registration and authentication
- Profile management (dietary restrictions, allergies, preferences)
- AI-powered meal plan generation using Google's Gemini API
- Track and manage meal plans for up to 7 days

## Setup

### Prerequisites

- Python 3.8 or higher
- MongoDB Atlas account
- Google Gemini API key

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd backend
```

2. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Create a `.env` file with your configuration:

```
# MongoDB Atlas
MONGODB_URI=mongodb+srv://Admin:<db_password>@cuisinecompass.iognj1k.mongodb.net/?appName=CuisineCompass
DB_NAME=cuisinecompass

# Security
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Gemini API
GEMINI_API_KEY=your-gemini-api-key
```

### Running the Application

Start the FastAPI server:

```bash
uvicorn app.main:app --reload
```

The API will be available at http://localhost:8000

API documentation is available at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### Authentication

- `POST /register` - Register a new user
- `POST /token` - Login and get access token
- `POST /change-password` - Change user password

### User Profile

- `GET /users/me` - Get current user profile
- `PUT /users/profile` - Update user profile
- `PUT /users/profile/dietary-restrictions` - Update dietary restrictions
- `PUT /users/profile/allergies` - Update allergies
- `PUT /users/profile/disliked-ingredients` - Update disliked ingredients
- `PUT /users/profile/preferred-cuisines` - Update preferred cuisines
- `PUT /users/profile/goals` - Update nutrition goals

### Meal Plans

- `POST /meal-plans/generate` - Generate meal plans for specified days
- `GET /meal-plans/` - Get all meal plans for current user
- `POST /meal-plans/complete` - Mark a day's meal plan as complete
- `POST /meal-plans/generate-ahead` - Generate meal plans for remaining days (up
  to 7)
