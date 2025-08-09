import { auth } from "../../config/firebase.js";
import { sendPasswordResetEmail } from "firebase/auth";
import axios from 'axios';

// Login user via backend API
export const loginUser = async ({ email, password }) => {
  try {
    const response = await axios.post('/api/users/login', { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error || "Login failed");
  }
};

// Signup user via backend API
export const signupUser = async (userData) => {
  try {
    const response = await axios.post('/api/users', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error || "Signup failed");
  }
};

// Password reset email via Firebase
export const forgotPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { message: "Password reset link sent successfully." };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Update user profile via backend API
export const updateUserProfile = async (userId, userData, token) => {
  try {
    const response = await axios.put(`/api/users/${userId}`, userData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error || "Failed to update profile");
  }
};