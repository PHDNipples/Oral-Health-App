// AuthPage.jsx
import React, { useState } from 'react';
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';

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
      <div className="auth-container">
        <h2>Welcome, {currentUser.name}!</h2>
        <p>You are logged in with the email: {currentUser.email}</p>
        <p>Your database ID is: {currentUser._id}</p>
        {/* You could add a logout button here */}
      </div>
    );
  }

  // If no user is logged in, show the appropriate form
  return (
    <div className="auth-container">
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
  );
}

