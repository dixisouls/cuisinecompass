import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi, userApi } from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in on initial load
    const token = localStorage.getItem("token");

    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await userApi.getProfile();
      setCurrentUser(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authApi.login({ username: email, password });
      localStorage.setItem("token", response.data.access_token);

      // Fetch user profile after successful login
      await fetchUserProfile();

      toast.success("Login successful!");
      navigate("/dashboard");
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.detail || "Login failed. Please try again."
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      await authApi.register(userData);
      toast.success("Registration successful! Please log in.");
      navigate("/login");
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        error.response?.data?.detail || "Registration failed. Please try again."
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    toast.info("You have been logged out.");
    navigate("/login");
  };

  const changePassword = async (oldPassword, newPassword) => {
    try {
      setLoading(true);
      await authApi.changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      });
      toast.success("Password changed successfully!");
      return true;
    } catch (error) {
      console.error("Change password error:", error);
      toast.error(
        error.response?.data?.detail ||
          "Failed to change password. Please try again."
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      await userApi.updateProfile(profileData);
      await fetchUserProfile(); // Refresh user data
      toast.success("Profile updated successfully!");
      return true;
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error(
        error.response?.data?.detail ||
          "Failed to update profile. Please try again."
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    changePassword,
    updateProfile,
    fetchUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
