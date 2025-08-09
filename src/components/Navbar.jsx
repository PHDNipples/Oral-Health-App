import React from 'react';
import { useNavigate } from "react-router-dom";
import { auth, signOut } from "../../config/firebase";
import { useAuth } from "../context/useAuth";


const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("firebase_token");
      localStorage.removeItem("user");
      console.log("User logged out successfully");
      navigate("/auth");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">Oral Health App</div>
      <ul className="nav-links">
        <li><a href="#treatments">Treatments</a></li>
        <li><a href="#who-we-are">Who We Are</a></li>
        <li><a href="#offers">Offers & Promotions</a></li>
        <li><a href="#team">Meet Our Team</a></li>
        <li><a href="#payment">Payment Options</a></li>
        <li><a href="#case-studies">Case Studies</a></li>
        <li><a href="#reviews">Patient Reviews</a></li>
        <li><a href="#contact">Contact</a></li>
        {currentUser ? (
          <li>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </li>
        ) : (
          <li>
            <a href="/auth">Login</a>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;