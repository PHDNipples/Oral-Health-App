// frontend/src/context/useAuth.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { loginUser as backendLogin, logoutUser as backendLogout } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  const logout = async () => {
    if (token) {
      await backendLogout(token);
    }
    await signOut(auth);
    setCurrentUser(null);
    setToken(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setCurrentUser(user);

        try {
          // Get Firebase ID token
          const idToken = await user.getIdToken(true);

          // Send to backend to get backend JWT
          const response = await backendLogin(idToken);
          setToken(response.token); // store backend JWT
        } catch (err) {
          console.error('Error fetching backend JWT:', err);
          setToken(null);
        }
      } else {
        setCurrentUser(null);
        setToken(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading, token, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
