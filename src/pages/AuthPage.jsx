import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import ForgotPasswordForm from "../components/ForgotPasswordForm";

export default function AuthPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState("login"); // "login" | "signup" | "forgot"

  const onLoginSuccess = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setMessage("Login successful!");
    navigate("/");
  };
  
  const onLoginError = (errorMessage) => {
    setMessage(errorMessage);
  };

  return (
    <div className="auth-container">
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

      {message && <p className="message-text">{message}</p>}
    </div>
  );
}