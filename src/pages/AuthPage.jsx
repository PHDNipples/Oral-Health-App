// AuthPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Using the useAuth hook
import SignupForm from '../components/SignupForm';
import LoginForm from '../components/LoginForm';
import { auth } from '../../config/firebase'; // Assuming you have a firebase config file
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import '../App.css';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { currentUser, setCurrentUser, setLoading } = useAuth(); // Get state and setters from context
  const navigate = useNavigate();

  // Function to handle a successful login
  const handleLogin = async (userCredential) => {
    try {
      setLoading(true);
      // Get the Firebase ID token for the authenticated user
      const token = await userCredential.user.getIdToken();
      
      // Send the token to your backend to get the user's data from MongoDB
      const response = await axios.post("/api/auth/login", {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Set the user in the global authentication context
      setCurrentUser(response.data.user);
    } catch (err) {
      console.error("Login to backend failed:", err);
      // Handle the error gracefully, maybe show a message
    } finally {
      setLoading(false);
    }
  };

  // Use a useEffect hook to handle navigation
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]); // The effect re-runs whenever currentUser or navigate changes

  // If no user is logged in, show the appropriate form
  return (
    <div className="auth-container">
      {isLogin ? (
        <LoginForm
          onLogin={handleLogin} // Passing the corrected handleLogin function
          onSwitchToSignup={() => setIsLogin(false)}
        />
      ) : (
        <SignupForm
          onSwitchToLogin={() => setIsLogin(true)}
        />
      )}
    </div>
  );
}
