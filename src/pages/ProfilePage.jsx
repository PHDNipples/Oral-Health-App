import React, { useState, useEffect } from 'react';
// We no longer need these Firestore imports as we're fetching from our own API.
// import { doc, onSnapshot } from 'firebase/firestore';
// import { db } from '../../config/firebase'; 
import { useAuth } from '../context/useAuth';

const ProfilePage = () => {
  // Use the custom useAuth hook to get the current user and authentication loading state.
  const { currentUser, loading: authLoading } = useAuth();
  
  // State to hold the user's profile data fetched from our backend API.
  const [userData, setUserData] = useState(null);
  
  // State to track the loading status of the API call.
  const [apiLoading, setApiLoading] = useState(true);

  useEffect(() => {
    // 1. Guard clause: Do not proceed if authentication is still loading or if there's no user.
    if (authLoading || !currentUser) {
      setUserData(null);
      setApiLoading(false);
      return;
    }

    // 2. Define an async function to fetch data from our backend.
    const fetchUserProfile = async () => {
      setApiLoading(true);
      try {
        // We'll make a GET request to a new backend endpoint.
        // This endpoint will be responsible for querying the MongoDB database.
        // We pass the Firebase UID in the URL.
        const response = await fetch(`/api/users/${currentUser.uid}`);
        
        if (!response.ok) {
          throw new Error('User not found or network error.');
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data from backend:', error);
        setUserData(null);
      } finally {
        setApiLoading(false);
      }
    };

    // 3. Call the fetch function when the component mounts or when the user changes.
    fetchUserProfile();

    // The effect depends on the user object and auth loading state.
  }, [currentUser, authLoading]); 

  // Display a loading message while we wait for auth and the API call to complete.
  if (authLoading || apiLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <p>Loading profile...</p>
      </div>
    );
  }

  // Display a message if there is no current user.
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <h1 className="text-4xl font-bold mb-6 text-center">Your Profile</h1>
      {userData ? (
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          {/* Display data from the MongoDB user object */}
          <p className="text-lg mb-2"><strong>Name:</strong> {userData.name || 'Not Set'}</p>
          <p className="text-lg mb-2"><strong>Email:</strong> {userData.email || 'Not Set'}</p>
          <p className="text-lg mb-2"><strong>Firebase UID:</strong> {userData.firebaseUID}</p>
          <pre className="mt-4 p-4 text-sm bg-gray-50 dark:bg-gray-700 rounded-lg overflow-x-auto">
            {JSON.stringify(userData, null, 2)}
          </pre>
        </div>
      ) : (
        <div className="text-center mt-12">
          <p className="text-xl">No profile data found.</p>
          <p className="text-md mt-4">This could mean a document for your user ID has not been created in MongoDB yet.</p>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
