import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import { useAuth } from './context/useAuth';
import { caseStudies } from './data/case-studies';
import { treatments } from './data/treatments';
import ProfilePage from './pages/ProfilePage';
import HomeContent from './pages/Home';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return currentUser ? children : <Navigate to="/auth" />;
};

function App() {
  return (
    <div className="App">
      {/* We only need Routes here, not another Router. */}
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<ProtectedRoute><Navbar /><HomeContent /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Navbar /><ProfilePage /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;
