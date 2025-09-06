// src/pages/AuthPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth"; // Import your auth hook
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import ForgotPasswordForm from "../components/ForgotPasswordForm";
import "./AuthPage.css";

export default function AuthPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Get the currentUser state from the auth context
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState("login");

  // Check for authentication on component mount
  useEffect(() => {
    if (currentUser) {
      // If a user is logged in, redirect them to the home page
      navigate("/");
    }
  }, [currentUser, navigate]); // Rerun this effect whenever currentUser changes

  const onLoginSuccess = (userData, token) => {
    localStorage.setItem("firebase_token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setMessage("Login successful!");
    // The redirect logic for successful login will now be handled by the useEffect hook
  };

  const onLoginError = (errorMessage) => {
    setMessage(errorMessage);
  };

  useEffect(() => {
    // Add the class to the body element when the component mounts
    document.body.classList.add('app-bg');

    // Remove the class from the body element when the component unmounts
    return () => {
      document.body.classList.remove('app-bg');
    };
  }, []);

  // If the user is logged in, this component will return null,
  // preventing the forms from being rendered at all.
  if (currentUser) {
    return null;
  }

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <div className="app-name"></div>
        {mode === "login" && (
          <LoginForm
            onLoginSuccess={onLoginSuccess}
            onLoginError={onLoginError}
            onSwitchToSignup={() => { setMode("signup"); setMessage(""); }}
            onSwitchToForgot={() => { setMode("forgot"); setMessage(""); }}
          />
        )}
        {mode === "signup" && (
          <SignupForm
            onSignupSuccess={onLoginSuccess}
            onSwitchToLogin={() => { setMode("login"); setMessage(""); }}
          />
        )}
        {mode === "forgot" && (
          <ForgotPasswordForm
            onSwitchToLogin={() => { setMode("login"); setMessage(""); }}
          />
        )}
      </div>

      {message && <p className="message-text">{message}</p>}
    </div>
  );
}