import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from "../../config/firebase";
import { useAuth } from '../context/useAuth';
import AtaataLogo from '../../src/'

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
      {/* Use the imported SVG in the src attribute */}
      <img src={AtaataLogo} alt="Ataata Logo" className="logo" />
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        {currentUser && (
          <li>
            <Link to="/profile">Profile</Link>
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
