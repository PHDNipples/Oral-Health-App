import { auth } from "../../config/firebase.js";

import { signInWithEmailAndPassword } from "firebase/auth";

export const loginUser = async ({ email, password }) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // A real token is now retrieved from Firebase
    const token = await user.getIdToken();

    return { user, token };
  } catch (error) {
    console.error("Firebase login error:", error);
    // Throw a new error with a user-friendly message
    throw new Error("Login failed. Please check your email and password.");
  }
};