// frontend/src/services/authService.js

export const loginUser = async (firebaseIdToken) => {
  const response = await fetch('/api/auth/login-firebase', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idToken: firebaseIdToken }), // Send Firebase ID token
  });

  if (!response.ok) {
    const errMsg = await response.text();
    throw new Error(`Failed to login with backend: ${errMsg}`);
  }

  return response.json(); // returns { token, user }
};

export const logoutUser = async (token) => {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error('Failed to revoke backend session');
  }
};
