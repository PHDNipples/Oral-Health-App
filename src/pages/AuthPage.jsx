// src/pages/AuthPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import ForgotPasswordForm from "../components/ForgotPasswordForm";
import "./AuthPage.css";

export default function AuthPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState("login");

  const onLoginSuccess = (userData, token) => {
    localStorage.setItem("firebase_token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setMessage("Login successful!");
    navigate("/");
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

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        {/*
         * This element will display the website name.
         * The CSS you were given will position and style it correctly.
         */}
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
