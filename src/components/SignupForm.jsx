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
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-3xl font-bold text-center text-[#00539b] mb-6">Sign Up</h2>
      <div className="space-y-4">
        <input 
          type="text" 
          placeholder="Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00539b] transition-colors" 
          required 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00539b] transition-colors" 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00539b] transition-colors" 
          required 
        />
      </div>
      <button 
        type="submit" 
        className="w-full px-4 py-2 text-white bg-[#00539b] rounded-md hover:bg-[#004a8c] focus:outline-none focus:ring-2 focus:ring-[#00539b] focus:ring-offset-2 transition-colors"
      >
        Sign Up
      </button>
      {message && <p className="text-green-600 text-sm text-center">{message}</p>}
      {error && <p className="text-red-600 text-sm text-center">{error}</p>}
      <div className="text-center text-sm mt-6">
        <p>Already have an account? <a href="#" onClick={onSwitchToLogin} className="text-[#00539b] hover:underline">Login</a></p>
      </div>
    </form>
  );
}
