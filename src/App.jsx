import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';    // this page handles login
import SignupPage from './pages/SignupPage'; // create this page for sign up
import Home from './pages/Home';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        {/* Login page */}
        <Route path="/login" element={<AuthPage />} />
        {/* Signup page */}
        <Route path="/signup" element={<SignupPage />} />
        {/* Home page */}
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
