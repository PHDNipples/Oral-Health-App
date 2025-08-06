import React, { useState } from 'react';

const initialState = { name: '', email: '', password: '' };

export default function UserForm({ onSubmit, user = initialState, submitLabel = 'Create User' }) {
  const [form, setForm] = useState(user);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(form);
    setForm(initialState);
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
      />
      <button type="submit">{submitLabel}</button>
    </form>
  );
}
