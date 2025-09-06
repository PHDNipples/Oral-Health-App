// src/pages/SecuritySettings.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { ShieldCheck, Key, Lock, Fingerprint } from 'lucide-react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { QRCodeSVG } from 'qrcode.react'; // New import for dynamic QR code generation

// Custom CSS for the modal
const modalStyles = `
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  z-index: 1000; /* Ensure the modal is on top */
}

.modal-content {
  background-color: white;
  border-radius: 0.75rem; /* Equivalent to rounded-xl */
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); /* Equivalent to shadow-2xl */
  padding: 1.5rem; /* Equivalent to p-6 */
  max-width: 24rem; /* Equivalent to max-w-sm */
  width: 100%;
}

.dark .modal-content {
  background-color: #1f2937; /* Equivalent to dark:bg-gray-800 */
}
`;

const SecuritySettings = () => {
  const { currentUser, loading: authLoading } = useAuth();
  
  // State for user feedback messages and confirmation dialog visibility
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // --- New State for 2FA Feature ---
  const [is2faEnabled, setIs2faEnabled] = useState(false); // Tracks if 2FA is enabled
  const [show2faSetup, setShow2faSetup] = useState(false); // Toggles the 2FA setup form
  const [qrCodeUrl, setQrCodeUrl] = useState(''); // Stores the QR code URL
  const [totpCode, setTotpCode] = useState(''); // Stores the user's TOTP code
  const [is2faLoading, setIs2faLoading] = useState(false); // Loading state for 2FA operations

  // Function to show the confirmation dialog for password reset
  const handleShowConfirm = () => {
    setMessage(''); // Clear any previous messages
    setIsError(false);
    setShowConfirm(true);
  };

  // Function to handle the password reset request after confirmation
  const handlePasswordReset = async () => {
    // Hide the confirmation dialog and show a sending state
    setShowConfirm(false);
    setIsSending(true);

    if (!currentUser || !currentUser.email) {
      setMessage('No user found or email not available.');
      setIsError(true);
      setIsSending(false);
      return;
    }

    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, currentUser.email);
      setMessage('A password reset email has been sent to your email address.');
      setIsError(false);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      setMessage('Failed to send password reset email. Please try again.');
      setIsError(true);
    } finally {
      setIsSending(false);
    }
  };

  // --- New 2FA Functions ---
  const handleEnable2FA = async () => {
    setIs2faLoading(true);
    // In a real application, you would call a backend function to generate a 2FA secret
    // and a QR code based on that secret for the current user.
    // For this example, we use a placeholder image.
    try {
      // Simulate API call to get a 2FA setup URI
      console.log('Simulating QR code generation...');
      // A valid otpauth URI is required here. Example:
      // otpauth://totp/Example:alice@google.com?secret=JBSWY3DPEHPK3PXP&issuer=Example
      const dummySecret = 'JBSWY3DPEHPK3PXP'; // Replace with a unique, securely generated secret
      const dummyEmail = currentUser.email || 'user@example.com';
      const otpUri = `otpauth://totp/MyApp:${dummyEmail}?secret=${dummySecret}&issuer=MyApp`;

      setQrCodeUrl(otpUri);
      setShow2faSetup(true);
      setMessage(''); // Clear previous messages
      setIsError(false);
    } catch (error) {
      setMessage('Failed to generate 2FA QR code. Please try again.');
      setIsError(true);
    } finally {
      setIs2faLoading(false);
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setIs2faLoading(true);
    // In a real application, you would send the user's TOTP code to your backend
    // to verify it against the stored secret.
    try {
      // Simulate verification
      console.log(`Verifying TOTP code: ${totpCode}...`);
      if (totpCode === '123456') { // Dummy code check
        setIs2faEnabled(true);
        setShow2faSetup(false);
        setTotpCode('');
        setMessage('Two-factor authentication has been successfully enabled!');
        setIsError(false);
      } else {
        setMessage('Invalid verification code. Please try again.');
        setIsError(true);
      }
    } catch (error) {
      setMessage('Verification failed. Please try again.');
      setIsError(true);
    } finally {
      setIs2faLoading(false);
    }
  };

  const handleDisable2FA = () => {
    setIs2faLoading(true);
    // In a real application, you would call a backend function to disable 2FA
    // for the current user.
    try {
      // Simulate disabling
      console.log('Disabling 2FA...');
      setIs2faEnabled(false);
      setMessage('Two-factor authentication has been disabled.');
      setIsError(false);
    } catch (error) {
      setMessage('Failed to disable 2FA. Please try again.');
      setIsError(true);
    } finally {
      setIs2faLoading(false);
    }
  };

  if (authLoading || isSending || is2faLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <p>{isSending ? 'Sending password reset email...' : is2faLoading ? 'Processing 2FA request...' : 'Loading security settings...'}</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <p>Please log in to view your security settings.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Inject the custom CSS styles into the DOM */}
      <style>{modalStyles}</style>

      <main className="max-w-4xl mx-auto space-y-8">
        
        {/* Security Settings Section */}
        <section className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-t-4 border-yellow-500">
          <div className="flex items-center space-x-4 mb-4">
            <ShieldCheck className="w-8 h-8 text-yellow-500" />
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Security Settings</h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Manage your account security, including your password and sign-in methods.
          </p>
          
          {/* Password Reset Feature */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center mb-2 sm:mb-0">
              <Key className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
              <p className="text-gray-700 dark:text-gray-300 font-medium">Reset Your Password</p>
            </div>
            <button
              onClick={handleShowConfirm}
              className="px-4 py-2 text-sm font-semibold rounded-lg shadow-md transition-colors
                          bg-yellow-500 text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              Send Reset Email
            </button>
          </div>
          
          {message && (
            <div className={`mt-4 p-3 rounded-lg text-sm text-center font-medium ${isError ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200' : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'}`}>
              {message}
            </div>
          )}

          {/* New Two-Factor Authentication (2FA) Feature */}
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center mb-2 sm:mb-0">
              <Fingerprint className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
              <p className="text-gray-700 dark:text-gray-300 font-medium">Two-Factor Authentication (2FA)</p>
            </div>
            {is2faEnabled ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">Enabled</span>
                <button
                  onClick={handleDisable2FA}
                  className="px-4 py-2 text-sm font-semibold rounded-lg shadow-md transition-colors
                              bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Disable 2FA
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Disabled</span>
                <button
                  onClick={handleEnable2FA}
                  className="px-4 py-2 text-sm font-semibold rounded-lg shadow-md transition-colors
                              bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Enable 2FA
                </button>
              </div>
            )}
          </div>

          <div className="mt-2 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-between opacity-50 cursor-not-allowed">
            <div className="flex items-center">
              <Lock className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
              <p className="text-gray-700 dark:text-gray-300 font-medium">Manage Recognized Devices</p>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Coming Soon</span>
          </div>
          
        </section>
        
      </main>

      {/* Confirmation Dialog Modal with custom CSS */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Confirm Password Reset</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Are you sure you want to send a password reset email to **{currentUser.email}**?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordReset}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2FA Setup Modal */}
      {show2faSetup && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Enable Two-Factor Authentication</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Scan the QR code below with your preferred authenticator app (e.g., Google Authenticator, Authy) and enter the 6-digit code to verify.
            </p>
            <div className="flex justify-center mb-4 p-4 bg-gray-200 dark:bg-gray-700 rounded-lg">
              {/* This component will now dynamically generate the QR code */}
              <QRCodeSVG
                value={qrCodeUrl}
                size={200}
                bgColor={'#ffffff'}
                fgColor={'#000000'}
              />
            </div>
            <form onSubmit={handleVerify2FA}>
              <input
                type="text"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
                className="w-full px-4 py-2 text-sm text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-lg border border-transparent focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter 6-digit code"
                maxLength="6"
                required
              />
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShow2faSetup(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  Verify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecuritySettings;
