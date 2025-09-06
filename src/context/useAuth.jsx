// src/context/useAuth.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth'; 
import { auth } from '../../config/firebase';

// 1. Create a context for authentication state.
export const AuthContext = createContext(null);

// 2. The AuthProvider component.
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // This function handles the logout logic using Firebase's signOut method.
    const logout = () => {
        return signOut(auth);
    };

    // Set up an effect to listen for changes in the Firebase auth state.
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    // 3. The value provided by the context.
    // We now include the logout function in this value object.
    const value = {
        currentUser,
        loading,
        logout, // <--- This line was missing, causing the error.
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// 4. A custom hook to easily access the auth context.
export const useAuth = () => {
    return useContext(AuthContext);
};