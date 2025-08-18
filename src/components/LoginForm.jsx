// src/components/LoginForm.jsx
import { useState } from "react";
import { loginUser } from "../api/auth";

export default function LoginForm({ onLoginSuccess, onLoginError, onSwitchToSignup, onSwitchToForgot }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = await loginUser({ email, password });
      console.log("Login success:", userData);
      onLoginSuccess(userData.user, userData.token);
    } catch (err) {
      console.error("Login failed:", err.message);
      onLoginError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Login</h2>
      <div className="input-group">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-input"
        />
      </div>
      <div className="input-group">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-input"
        />
      </div>
      <button type="submit" className="white-button">
        Login
      </button>

      <div className="auth-links">
        <p>Don't have an account? <a href="#" onClick={onSwitchToSignup}>Sign Up</a></p>
        <p>Forgot password? <a href="#" onClick={onSwitchToForgot}>Reset Password</a></p>
      </div>
    </form>
  );
}
