// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize individual services
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export services you need, including signOut
export { app, auth, db, storage, analytics, signOut };