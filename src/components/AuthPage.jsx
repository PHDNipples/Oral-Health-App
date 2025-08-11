// AuthPage.jsx
import React, { useState } from 'react';
import SignupForm from '../components/SignupForm';
import LoginForm from '../components/LoginForm';

export default function AuthPage() {
  // State to manage which form is currently displayed
  const [isLogin, setIsLogin] = useState(true);

  // State to hold the current user's data after a successful login
  const [currentUser, setCurrentUser] = useState(null);

  // This function is passed to LoginForm. It will be called with the
  // user data when login is successful.
  const handleLogin = (userData) => {
    setCurrentUser(userData);
    console.log("User logged in:", userData);
    // Here you would typically redirect the user or show a new part of the UI
  };

  // If a user is logged in, show their details.
  if (currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8f8f8]">
        <div className="w-full max-w-md bg-white p-10 rounded-xl shadow-[0_2px_16px_rgba(0,83,155,0.08)]">
          <h2 className="text-3xl font-bold text-center text-[#00539b] mb-6">Welcome, {currentUser.name}!</h2>
          <p className="text-center text-gray-600 mb-2">You are logged in with the email: {currentUser.email}</p>
          <p className="text-center text-gray-600">Your database ID is: {currentUser._id}</p>
          {/* You could add a logout button here */}
        </div>
      </div>
    );
  }

  // If no user is logged in, show the appropriate form
  return (
    // Outer container for the full screen with a light gray background
    <div className="flex items-center justify-center min-h-screen bg-[#f8f8f8]">
      {/* Inner container for the form, styled to match the provided CSS 'main' section */}
      <div className="w-full max-w-md bg-white p-10 rounded-xl shadow-[0_2px_16px_rgba(0,83,155,0.08)]">
        {isLogin ? (
          <LoginForm
            onLogin={handleLogin} // Passing the handleLogin function as a prop
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
