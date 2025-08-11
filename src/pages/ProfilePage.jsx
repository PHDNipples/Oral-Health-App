import React, { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import { updateUserProfile } from "../api/auth";

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(currentUser || { name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (currentUser) {
      setProfile(currentUser);
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const updatedUser = await updateUserProfile(profile.id, profile, token);
      localStorage.setItem("user", JSON.stringify(updatedUser.user));
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-lg">Loading profile...</div>;

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">User Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-gray-700 font-medium">Name:</label>
            <input
              type="text"
              name="name"
              id="name"
              value={profile.name || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-gray-700 font-medium">Email:</label>
            <input
              type="email"
              id="email"
              value={profile.email}
              disabled
              className="w-full px-4 py-2 bg-gray-200 border border-gray-300 rounded-md focus:outline-none"
            />
          </div>
          <button 
            type="submit" 
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors" 
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
        {message && <p className="text-green-600 text-sm text-center mt-4">{message}</p>}
        {error && <p className="text-red-600 text-sm text-center mt-4">{error}</p>}
      </div>
    </div>
  );
}
