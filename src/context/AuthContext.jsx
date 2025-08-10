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

  // The value object contains the current user, loading state, and any
  // functions needed for authentication (like signup, login, logout).
  // We're just providing the state for now, as the components themselves will handle the functions.
  const value = {
    currentUser,
    loading,
    // Other functions like login, signup, logout can be added here if needed,
    // but for now, we'll handle them directly in the components to simplify the flow.
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Only render children once the loading is complete to prevent flashes of unauthenticated content. */}
      {!loading && children}
    </AuthContext.Provider>
  );
}
