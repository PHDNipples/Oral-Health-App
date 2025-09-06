import React, { useState } from "react";
import { auth } from "../../config/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPasswordForm({ onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("A password reset link has been sent to your email.");
      setEmail("");
    } catch (err) {
      console.error("Password reset error:", err);
      // Display a user-friendly error message
      setError("Failed to send reset email. Please check your email address.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Forgot Password</h2>
      <p>Enter your email address to receive a password reset link.</p>
      <div className="input-group">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-input"
        />
      </div>
      <button type="submit" className="form-button">
        Send Reset Email
      </button>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="auth-links">
        <p>Remember your password? <a href="#" onClick={onSwitchToLogin}>Login</a></p>
      </div>
    </form>
  );
}