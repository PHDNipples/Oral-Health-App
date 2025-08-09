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
    <div className="profile-container">
      <h2>User Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={profile.name || ''}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div className="input-group">
          <label>Email:</label>
          <input
            type="email"
            value={profile.email}
            disabled
            className="form-input"
          />
        </div>
        <button type="submit" className="form-button" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}