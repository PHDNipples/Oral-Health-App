import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2kzvG_J-9Th68K83wJ6nwmZQLI_-EVH8",
  authDomain: "oral-health-app-ac035.firebaseapp.com",
  projectId: "oral-health-app-ac035",
  storageBucket: "oral-health-app-ac035.appspot.com",
  messagingSenderId: "940940097238",
  appId: "1:940940097238:web:fbee068eacf558dddf7b77",
  measurementId: "G-72BDRGWWRS"
};

// Global variables provided by the Canvas environment
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// Safely initialize Firebase to prevent the "duplicate app" error
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Export the Firebase services for use in other components
export const auth = getAuth(app);
export const db = getFirestore(app);
export { initialAuthToken, appId };
