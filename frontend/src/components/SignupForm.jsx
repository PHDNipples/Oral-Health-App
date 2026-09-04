import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../config/firebase";
import { apiUrl } from "../config/api";

export default function SignupForm({ onSignupSuccess, onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Update Firebase profile with displayName
      await updateProfile(userCredential.user, { displayName: name });

      // Get Firebase ID token for backend verification
      const token = await userCredential.user.getIdToken();

      // Call backend to create user in MongoDB
      const response = await fetch(apiUrl("/api/auth/signup"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken: token }),
      });

      if (!response.ok) {
        const err = await response.json();
        setError(err.message || "Failed to create user in backend.");
        return;
      }

      const userData = await response.json();

      if (onSignupSuccess) onSignupSuccess(userData.user, userData.token);
    } catch (err) {
      setError(err.message || "Signup failed.");
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <h2>Create Account</h2>
      <input
        type="text"
        placeholder="Full Name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
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
      <input
        type="password"
        placeholder="Confirm Password"
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button type="submit">Sign Up</button>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <p>
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          style={{
            color: "blue",
            cursor: "pointer",
            background: "none",
            border: "none",
            padding: 0,
            fontSize: "inherit",
          }}
        >
          Log In
        </button>
      </p>
    </form>
  );
}
