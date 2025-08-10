import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
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

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Login</h2>
      <div className="input-group">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" required />
      </div>
      <button type="submit" className="form-button">Login</button>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <div className="auth-links">
        <p>Don't have an account? <a href="#" onClick={onSwitchToSignup}>Sign Up</a></p>
      </div>
    </form>
  );
}
