import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SignupForm from '../components/SignupForm';
import LoginForm from '../components/LoginForm';
import axios from 'axios';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  // Now we can correctly destructure and use setLoading and setCurrentUser
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
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
