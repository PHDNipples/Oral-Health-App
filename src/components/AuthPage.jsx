import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SignupForm from '../components/SignupForm';
import LoginForm from '../components/LoginForm';
import axios from 'axios';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { currentUser, setCurrentUser, setLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (userCredential) => {
    try {
      setLoading(true);
      const token = await userCredential.user.getIdToken();
      
      const response = await axios.post("/api/auth/login", {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setCurrentUser(response.data.user);
    } catch (err) {
      console.error("Login to backend failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  return (
    // This is the parent container. We use flexbox utilities to center the child element both horizontally and vertically.
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      {/* This is the card that contains the forms. It has a max width, rounded corners, a shadow, and padding. */}
      <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-2xl">
        {isLogin ? (
          <LoginForm
            onLogin={handleLogin}
            onSwitchToSignup={() => setIsLogin(false)}
          />
        ) : (
          <SignupForm
            onSwitchToLogin={() => setIsLogin(true)}
          />
        )}
      </div>
    </div>
  );
}
