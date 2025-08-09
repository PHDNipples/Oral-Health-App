import React from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { signOut } from "../../config/firebase";
import { auth } from "../../config/firebase";


const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth); // This is needed if you're using Firebase services
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      console.log("User logged out successfully");
      navigate("/auth");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">Oral Health App</Link>
      </div>
      <ul className="nav-links">
        {/* ... existing links ... */}
        {currentUser ? (
          <>
            <li><Link to="/profile">Profile</Link></li>
            <li>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/auth">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;