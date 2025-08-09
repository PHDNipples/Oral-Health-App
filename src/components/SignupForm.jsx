// frontend/src/components/SignupForm.jsx
import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../config/firebase";
import axios from 'axios';

export default function SignupForm({ onSwitchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      // 1. Create the user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Update the user's profile with their name in Firebase
      await updateProfile(userCredential.user, { displayName: name });
      
      // 3. Get the Firebase ID token
      const token = await userCredential.user.getIdToken();
      
      // 4. Send the user's details and the secure token to your backend
      const response = await axios.post("/api/auth/signup", {
        uid: userCredential.user.uid,
        name: name,
        email: email,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setMessage("Account created successfully! You can now log in.");
      console.log("Backend response:", response.data);

    } catch (err) {
      console.error("Signup error:", err);
      setError(err.response?.data?.error || err.message || "Signup failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Sign Up</h2>
      <div className="input-group">
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="form-input" required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" required />
      </div>
      <button type="submit" className="form-button">Sign Up</button>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <div className="auth-links">
        <p>Already have an account? <a href="#" onClick={onSwitchToLogin}>Login</a></p>
      </div>
    </form>
  );
}