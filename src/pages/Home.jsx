// home.jsx
import React from 'react';
import { Mail } from 'lucide-react';

// The Home component displays the user's ID and a button to go to the profile page.
const Home = ({ userId, onNavigateToProfile }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg text-center border-t-4 border-blue-500">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome</h1>
      <p className="text-gray-600 mb-6">Your unique user ID is:</p>
      <div className="bg-gray-100 text-gray-700 p-3 rounded-lg font-mono break-all mb-8">
        {userId}
      </div>
      <button
        onClick={onNavigateToProfile}
        className="flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
      >
        <Mail className="h-5 w-5 mr-2" />
        View and Edit Profile
      </button>
    </div>
  );
};

export default Home;
