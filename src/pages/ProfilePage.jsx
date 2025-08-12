import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, deleteDoc } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import { User, Save, ArrowLeft, Key, Trash2, X } from 'lucide-react';

// Import the auth, db, and appId from the central config file
import { auth, db, appId } from '../../config/firebase';
import { useAuth } from '../context/useAuth';

const ProfilePage = ({ onNavigateToHome }) => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState({ name: '', bio: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState({ text: '', type: '' });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('');

  const userId = currentUser?.uid;

  const profileCollectionName = 'profile';
  const profileDocId = 'details';

  // --- Profile Data Handling (Real-time Firestore Listener) ---
  useEffect(() => {
    // Crucial: A null or undefined userId means we are not ready.
    // We can safely return and wait for the auth state to resolve.
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const profileDocRef = doc(db, 'artifacts', appId, 'users', userId, profileCollectionName, profileDocId);

    const unsubscribe = onSnapshot(
      profileDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
          setProfile({ name: '', bio: '' });
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching profile document:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]); // The effect now depends only on userId, ensuring it re-runs when a valid ID is available.

  // --- Handlers for User Actions ---

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!db || !userId) return;

    setSaving(true);
    try {
      const profileDocRef = doc(db, 'artifacts', appId, 'users', userId, profileCollectionName, profileDocId);
      await setDoc(profileDocRef, profile, { merge: true });
      console.log("Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage({ text: '', type: '' });

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ text: 'New passwords do not match.', type: 'error' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ text: 'Password must be at least 6 characters long.', type: 'error' });
      return;
    }

    try {
      setPasswordMessage({ text: 'Password cannot be changed without re-authentication. Please log in again to update your password.', type: 'error' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordMessage({ text: `Failed to change password: ${error.message}`, type: 'error' });
    }
  };

  const handleDeleteAccount = async () => {
    if (!auth || !auth.currentUser) {
      setDeleteErrorMessage('No active user to delete.');
      return;
    }

    try {
      await deleteUser(auth.currentUser);
      const profileDocRef = doc(db, 'artifacts', appId, 'users', userId, profileCollectionName, profileDocId);
      await deleteDoc(profileDocRef);

      console.log("Account and data deleted successfully!");
      onNavigateToHome();
    } catch (error) {
      console.error("Error deleting account:", error);
      setDeleteErrorMessage('Failed to delete account. You may need to log in again to perform this action.');
    } finally {
      setShowDeleteModal(false);
    }
  };


  // --- Render UI ---

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg text-center border-t-4 border-purple-500">
        <p className="text-xl font-semibold text-gray-700">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 min-h-screen bg-gray-100">
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
        
        {/* User ID Section */}
        <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-sm font-medium text-purple-700 mb-1">Your User ID:</p>
          <p className="font-mono text-xs text-gray-600 break-all">{userId}</p>
        </div>

        {/* Profile Details Section */}
        <form onSubmit={handleSave} className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Profile Details</h3>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name</label>
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
            <label htmlFor="bio" className="block text-gray-700 font-medium mb-2">Bio</label>
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
            {saving ? 'Saving...' : <><Save className="h-5 w-5 mr-2" /> Save Profile</>}
          </button>
        </form>

        {/* Password Management Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Password Management</h3>
          <form onSubmit={handleChangePassword}>
            <div className="mb-4">
              <label htmlFor="new-password" className="block text-gray-700 font-medium mb-2">New Password</label>
              <input
                type="password"
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="confirm-password" className="block text-gray-700 font-medium mb-2">Confirm New Password</label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            {passwordMessage.text && (
              <p className={`text-sm mb-4 ${passwordMessage.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                {passwordMessage.text}
              </p>
            )}
            <button
              type="submit"
              className="flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <Key className="h-5 w-5 mr-2" /> Change Password
            </button>
          </form>
        </div>

        {/* Account Management Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Account Management</h3>
          <button
            onClick={() => {
              setDeleteErrorMessage('');
              setShowDeleteModal(true);
            }}
            className="flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <Trash2 className="h-5 w-5 mr-2" /> Delete My Account
          </button>
        </div>

        {/* Account Deletion Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="relative p-8 border w-96 shadow-lg rounded-md bg-white">
              <h3 className="text-lg font-bold text-red-600">Confirm Account Deletion</h3>
              <p className="mt-2 text-sm text-gray-600">
                Are you sure you want to delete your account? This action is permanent and cannot be undone.
              </p>
              {deleteErrorMessage && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                  <p className="text-sm">{deleteErrorMessage}</p>
                </div>
              )}
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-150"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-150"
                >
                  <Trash2 className="inline h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
