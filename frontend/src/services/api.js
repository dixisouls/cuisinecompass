import axios from "axios";

// Base API URL - change this based on environment
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to attach token to authenticated requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    // Handle token expiration
    if (response && response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// Authentication endpoints
export const authApi = {
  register: (userData) => api.post("/register", userData),
  login: (credentials) => api.post("/token", new URLSearchParams(credentials)),
  changePassword: (passwordData) => api.post("/change-password", passwordData),
};

// User profile endpoints
export const userApi = {
  getProfile: () => api.get("/users/me"),
  updateProfile: (profileData) => api.put("/users/profile", profileData),
  updateDietaryRestrictions: (restrictions) =>
    api.put("/users/profile/dietary-restrictions", restrictions),
  updateAllergies: (allergies) =>
    api.put("/users/profile/allergies", allergies),
  updateDislikedIngredients: (ingredients) =>
    api.put("/users/profile/disliked-ingredients", ingredients),
  updatePreferredCuisines: (cuisines) =>
    api.put("/users/profile/preferred-cuisines", cuisines),
  updateGoals: (goals) => api.put("/users/profile/goals", goals),
};

// Meal plan endpoints
export const mealPlanApi = {
  generateMealPlan: (days) => api.post("/meal-plans/generate", { days }),
  getUserMealPlans: () => api.get("/meal-plans/"),
  markDayComplete: (date) => api.post("/meal-plans/complete", { date }),
  generateAhead: () => api.post("/meal-plans/generate-ahead"),
};

export default api;
