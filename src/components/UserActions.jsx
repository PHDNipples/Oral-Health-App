import React, { useState } from 'react';
import UserForm from './UserForm';

const API_URL = '/api/users';

export default function UserActions() {
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');

  const createUser = async (data) => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    setMessage(result.message || result.error);
  };

  const updateUser = async (data) => {
    if (!userId) return setMessage('User ID required for update');
    const res = await fetch(`${API_URL}/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    setMessage(result.message || result.error);
  };

  const deleteUser = async () => {
    if (!userId) return setMessage('User ID required for delete');
    const res = await fetch(`${API_URL}/${userId}`, {
      method: 'DELETE' });
    const result = await res.json();
    setMessage(result.message || result.error);
  };

  return (
    <div className="user-actions">
      <h2>Create User</h2>
      <UserForm onSubmit={createUser} submitLabel="Create User" />
      <h2>Update User</h2>
      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={e => setUserId(e.target.value)}
      />
      <UserForm onSubmit={updateUser} submitLabel="Update User" />
      <h2>Delete User</h2>
      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={e => setUserId(e.target.value)}
      />
      <button onClick={deleteUser}>Delete User</button>
      {message && <p>{message}</p>}
    </div>
  );
}
