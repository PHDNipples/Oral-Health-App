// src/context/AuthContext.jsx
import React, { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../config/firebase";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  // `currentUser` stores the user object or null
  const [currentUser, setCurrentUser] = useState(null);
  // `loading` is true initially while we check the auth status
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged is the Firebase method to listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      // Once the check is complete (user or null), we set loading to false
      setLoading(false);
    });

    // Cleanup function to stop listening when the component unmounts
    return () => unsubscribe();
  }, []);

  // The context value now provides the user and loading status
  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {/* We only render the children once the authentication check is complete */}
      {!loading && children}
    </AuthContext.Provider>
  );
};
