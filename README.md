# CuisineCompass

CuisineCompass is a comprehensive meal planning application that helps users
organize their weekly meals based on dietary preferences, available ingredients,
and nutritional goals. The application uses AI-powered meal suggestions through
Google's Gemini API to create personalized meal plans.

## ✨ Live Demo

**[Try CuisineCompass Now!](https://cuisinecompass.vercel.app/)**

## 🍽️ Features

- **AI-Powered Meal Suggestions**: Leverage Google's Gemini API to generate meal
  plans based on your preferences.
- **Weekly Meal Planning**: Plan your meals for the entire week with a single
  click.
- **Dietary Preference Support**: Customize meal plans based on dietary
  restrictions and preferences.
- **Nutritional Information**: Track nutritional content of your planned meals.
- **Recipe Storage**: Save and access your favorite recipes.
- **Shopping List Generation**: Automatically create shopping lists from your
  meal plans.

## 🔧 Tech Stack

### Backend

- Python with FastAPI
- SQLAlchemy ORM
- Google Gemini API for AI-powered meal suggestions
- Pydantic for data validation

### Frontend

- React
- Material-UI for component styling
- Redux for state management
- Axios for API requests

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- Google Gemini API key

## 🚀 Installation & Setup

### Clone the Repository

```bash
git clone https://github.com/yourusername/cuisinecompass.git
cd cuisinecompass
```

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Create a .env file with your configuration:

```
DATABASE_URL=sqlite:///./app.db
GEMINI_API_KEY=your_gemini_api_key
SECRET_KEY=your_secret_key
```

5. Run the backend server:

```bash
uvicorn app.main:app --reload
```

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd ../frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a .env file:

```
REACT_APP_API_URL=http://localhost:8000
```

4. Start the development server:

```bash
npm start
```

## 📱 Usage

1. Navigate to `http://localhost:3000` in your browser
2. Create an account or log in
3. Set up your dietary preferences and restrictions
4. Generate a meal plan for the week
5. Customize individual meals as needed
6. Generate a shopping list based on your meal plan

## 📝 API Documentation

Once the backend server is running, you can view the interactive API
documentation at `http://localhost:8000/docs`.

Key endpoints:

- `/auth`: Authentication endpoints
- users: User management
- `/meal-plans`: Meal planning functionality
- `/recipes`: Recipe management
- `/preferences`: Dietary preferences

## 🐛 Known Issues

- Generating meal plans for an entire week may timeout due to Gemini API
  constraints. Consider generating plans one day at a time if this occurs.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for
details.

## 🙏 Acknowledgements

- [Google Gemini API](https://ai.google.dev/) for AI-powered meal suggestions
- [FastAPI](https://fastapi.tiangolo.com/) for the backend framework
- [React](https://reactjs.org/) for the frontend framework
