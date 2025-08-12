import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../config/firebase';

// 1. Create a context for authentication state.
// We'll export this so it can be used for the Provider and the hook.
export const AuthContext = createContext(null);

// 2. The AuthProvider component. This component will wrap your entire app
// and provide the authentication state to all its children.
// Note the `export const` here, which is a named export.
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set up an effect to listen for changes in the Firebase auth state.
  // This listener runs once when the component mounts and then every time
  // the user's login status changes (e.g., they log in or out).
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Update the state with the current user object.
      setCurrentUser(user);
      // Set loading to false once the initial check is complete.
      setLoading(false);
    });

    // Clean up the subscription when the component unmounts to prevent memory leaks.
    return unsubscribe;
  }, []); // The empty dependency array ensures this effect runs only once.

  // 3. The value provided by the context.
  // We make the currentUser object and the loading state available.
  const value = {
    currentUser,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Render the children only after the initial loading is complete. */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 4. A custom hook to easily access the auth context.
// This is the preferred way to consume the context in your components.
// Note the `export const` here as well.
export const useAuth = () => {
  return useContext(AuthContext);
};
