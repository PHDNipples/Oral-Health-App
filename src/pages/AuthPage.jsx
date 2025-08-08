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
    localStorage.setItem("firebase_token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    navigate("/home");
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      {mode === "login" && (
        <LoginForm
          onLogin={onLoginSuccess}
          onSwitchToSignup={() => setMode("signup")}
          onSwitchToForgot={() => setMode("forgot")}
        />
      )}
      {mode === "signup" && (
        <SignupForm
          onSignup={onLoginSuccess}
          onSwitchToLogin={() => setMode("login")}
        />
      )}
      {mode === "forgot" && (
        <ForgotPasswordForm
          onSwitchToLogin={() => setMode("login")}
        />
      )}

      {message && <p style={{ color: "red" }}>{message}</p>}
    </div>
  );
}
