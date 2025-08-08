import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";

export default function LoginForm({ onLogin, onSwitchToSignup, onSwitchToForgot }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();

      const response = await fetch("http://localhost:5000/api/auth/firebase-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const err = await response.json();
        setError(err.message || "Failed to log in to backend.");
        return;
      }

      const userData = await response.json();
      if (onLogin) onLogin(userData, token);
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <p>
        Don't have an account?{" "}
        <button type="button" onClick={onSwitchToSignup} style={{ color: "blue", cursor: "pointer", background: "none", border: "none" }}>
          Sign Up
        </button>
      </p>
      <p>
        Forgot your password?{" "}
        <button type="button" onClick={onSwitchToForgot} style={{ color: "blue", cursor: "pointer", background: "none", border: "none" }}>
          Reset Password
        </button>
      </p>
    </form>
  );
}
