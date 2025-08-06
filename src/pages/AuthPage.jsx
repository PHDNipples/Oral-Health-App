import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

export default function AuthPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const handleLogin = async (data) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setMessage(result.error || 'Login failed');
        return;
      }

      localStorage.setItem('token', result.token);
      navigate('/home');
    } catch (error) {
      setMessage('Login error');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <LoginForm onLogin={handleLogin} />
      {message && <p>{message}</p>}
    </div>
  );
}
