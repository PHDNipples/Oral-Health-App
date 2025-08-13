import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from "../../config/firebase";
import { useAuth } from '../context/useAuth';

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("firebase_token");
      localStorage.removeItem("user");
      console.log("User logged out successfully");
      // Redirect to the authentication page after logging out.
      navigate("/auth");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">Oral Health App</div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        {currentUser && (
          <li>
            {/* THIS IS THE FIX */}
            {/* We're now using a standard <a> tag with an href. */}
            {/* This will force a full page reload and send a request to your backend. */}
            <a href="/profile">Profile</a>
          </li>
        )}
        {currentUser ? (
          <li>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </li>
        ) : (
          <li><Link to="/auth">Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
