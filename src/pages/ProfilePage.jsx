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

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8f8f8] p-4">
      <div className="w-full max-w-md p-10 space-y-6 bg-white rounded-xl shadow-[0_2px_16px_rgba(0,83,155,0.08)]">
        <h2 className="text-3xl font-bold text-center text-[#00539b]">User Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Name:</label>
            <input
              type="text"
              name="name"
              value={profile.name || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00539b] transition-colors"
            />
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Email:</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-200 cursor-not-allowed focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-[#00539b] rounded-md hover:bg-[#004a8c] focus:outline-none focus:ring-2 focus:ring-[#00539b] focus:ring-offset-2 transition-colors"
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
