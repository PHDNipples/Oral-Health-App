// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { User, Mail, Smartphone, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css'; 

const ProfilePage = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState(null);
  const [apiLoading, setApiLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading || !currentUser) {
      setUserData(null);
      setApiLoading(false);
      return;
    }

    const fetchUserProfile = async () => {
      setApiLoading(true);
      try {
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

    fetchUserProfile();
  }, [currentUser, authLoading]); 

  if (authLoading || apiLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

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
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => navigate('/security')}
              className="flex items-center px-4 py-2 text-sm font-semibold rounded-lg shadow-md transition-colors
                         bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Security Settings
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
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
