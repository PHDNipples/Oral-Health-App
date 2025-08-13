import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { User, Mail, Smartphone } from 'lucide-react';

const ProfilePage = () => {
  // Use the custom useAuth hook to get the current user and authentication loading state.
  const { currentUser, loading: authLoading } = useAuth();
  
  // State to hold the user's profile data fetched from our backend API.
  const [userData, setUserData] = useState(null);
  
  // State to track the loading status of the API call.
  const [apiLoading, setApiLoading] = useState(true);

  useEffect(() => {
    // Guard clause: Do not proceed if authentication is still loading or if there's no user.
    if (authLoading || !currentUser) {
      setUserData(null);
      setApiLoading(false);
      return;
    }

    // Define an async function to fetch data from our backend.
    const fetchUserProfile = async () => {
      setApiLoading(true);
      try {
        // We'll make a GET request to a new backend endpoint.
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

    // Call the fetch function when the component mounts or when the user changes.
    fetchUserProfile();

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

  // Use a conditional render for the main content based on whether userData exists
  const ProfileContent = () => (
    <div className="min-h-screen p-8 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <main className="max-w-4xl mx-auto space-y-8">
        
        {/* Profile Info Section */}
        <section className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-t-4 border-blue-500">
          <div className="flex items-center space-x-4 mb-4">
            <User className="w-8 h-8 text-blue-500" />
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Personal Information</h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            This is where you can view and manage your personal details.
          </p>
          <div className="mt-4 space-y-2">
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
              <p className="text-gray-700 dark:text-gray-300"><strong>Email:</strong> {userData.email || 'Not provided'}</p>
            </div>
            <div className="flex items-center">
              <Smartphone className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
              <p className="text-gray-700 dark:text-gray-300"><strong>Name:</strong> {userData.name || 'Not provided'}</p>
            </div>
          </div>
        </section>
        
      </main>
    </div>
  );

  return userData ? <ProfileContent /> : (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="text-center mt-12">
        <p className="text-xl">No profile data found.</p>
        <p className="text-md mt-4">This could mean a document for your user ID has not been created in MongoDB yet.</p>
      </div>
    </div>
  );
};

export default ProfilePage;
