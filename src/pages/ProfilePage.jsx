// profilepage.jsx
import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { User, Save, ArrowLeft } from 'lucide-react';

const ProfilePage = ({ userId, db, onNavigateToHome }) => {
  const [profile, setProfile] = useState({ name: '', bio: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!db || !userId) return;

    setLoading(true);
    const profileDocRef = doc(db, 'artifacts', 'profile-app', 'users', userId);

    // Set up a real-time listener for the profile document.
    const unsubscribe = onSnapshot(
      profileDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
          // If the profile doesn't exist, initialize with empty values.
          setProfile({ name: '', bio: '' });
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching profile document:", error);
        setLoading(false);
      }
    );

    // Clean up the listener when the component unmounts.
    return () => unsubscribe();
  }, [db, userId]);

  // Handle form input changes.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  // Handle saving the profile to Firestore.
  const handleSave = async (e) => {
    e.preventDefault();
    if (!db || !userId) return;
    setSaving(true);
    try {
      const profileDocRef = doc(db, 'artifacts', 'profile-app', 'users', userId);
      await setDoc(profileDocRef, profile, { merge: true });
      console.log("Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg text-center border-t-4 border-purple-500">
        <p className="text-xl font-semibold text-gray-700">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg border-t-4 border-purple-500">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onNavigateToHome}
          className="flex items-center text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </button>
        <h2 className="text-2xl font-bold text-gray-800 flex-grow text-center pr-12">
          <User className="inline h-6 w-6 mr-2" />
          User Profile
        </h2>
      </div>

      <form onSubmit={handleSave}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={profile.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-150 ease-in-out"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="bio" className="block text-gray-700 font-medium mb-2">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself..."
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-150 ease-in-out"
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            'Saving...'
          ) : (
            <>
              <Save className="h-5 w-5 mr-2" />
              Save Profile
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
