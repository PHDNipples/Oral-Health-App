import React, { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../config/firebase";
import axios from 'axios';

export default function LoginForm({ onLogin, onSwitchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      // 1. Authenticate the user with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // 2. Get the Firebase ID token for the authenticated user
      const token = await userCredential.user.getIdToken();
      
      // 3. Send the token to your backend to get the user's data from MongoDB
      // This step verifies the token and fetches the user document
      const response = await axios.post("/api/auth/login", {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // 4. If successful, pass the user data to the parent component
      onLogin(response.data.user);
      setMessage("Login successful!");
      console.log("Logged in user data:", response.data.user);

    } catch (err) {
      console.error("Login error:", err);
      // Handle different types of errors from Firebase and the backend
      const errorMessage = err.response?.data?.error || err.message;
      setError(errorMessage || "Login failed. Please check your credentials.");
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError("Please enter your email to reset the password.");
      return;
    }
    setError("");
    setMessage("");
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent. Please check your inbox.");
    } catch (err) {
      console.error("Password reset error:", err);
      setError("Failed to send password reset email. Please check the email address.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-blue-900">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          {message && <p className="text-green-600 text-sm text-center">{message}</p>}
          <div className="space-y-4 flex flex-col items-center">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-80 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-80 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              required
            />
            <div className="flex justify-end w-80 text-sm">
              <button type="button" onClick={handlePasswordReset} className="text-blue-600 hover:underline focus:outline-none">
                Forgot Password?
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-900 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Login
          </button>
        </form>
        <div className="text-center text-sm">
          <p>Don't have an account? <a href="#" onClick={onSwitchToSignup} className="text-blue-600 hover:underline">Sign Up</a></p>
        </div>
      </div>
    </div>
  );
}
