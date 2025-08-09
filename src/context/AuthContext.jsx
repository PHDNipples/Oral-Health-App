import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.id;
          
          if (decodedToken.exp * 1000 < Date.now()) {
            localStorage.removeItem("token");
            setCurrentUser(null);
          } else {
            const user = JSON.parse(localStorage.getItem("user"));
            setCurrentUser(user);
          }
        } catch (error) {
          console.error("Invalid token:", error);
          localStorage.removeItem("token");
          setCurrentUser(null);
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};