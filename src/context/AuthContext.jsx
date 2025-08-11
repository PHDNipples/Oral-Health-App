// AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../../config/firebase"; // Import the Firebase auth instance
import { onAuthStateChanged } from "firebase/auth";

// Create the authentication context
export const AuthContext = createContext();

// Create a custom hook to use the authentication context
export function useAuth() {
  return useContext(AuthContext);
}

// Create the AuthProvider component to manage the authentication state
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // This useEffect hook sets up a listener for Firebase authentication state changes.
  // It runs only once when the component mounts.
  useEffect(() => {
    // onAuthStateChanged is the recommended Firebase method to handle user state.
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // A user is logged in.
        // We'll set the currentUser state and then get their MongoDB document.
        setCurrentUser(user);
      } else {
        // No user is logged in.
        setCurrentUser(null);
      }
      setLoading(false); // Stop the loading state once the initial check is complete.
    });

    // Clean up the listener when the component unmounts to prevent memory leaks.
    return unsubscribe;
  }, []);

  // The value object now includes the state setter functions,
  // making them available to components that use this context.
  const value = {
    currentUser,
    setCurrentUser, // Exposing the setter function
    loading,
    setLoading, // Exposing the setter function
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Only render children once the loading is complete to prevent flashes of unauthenticated content. */}
      {!loading && children}
    </AuthContext.Provider>
  );
}
