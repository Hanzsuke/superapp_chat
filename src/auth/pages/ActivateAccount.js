// src/auth/pages/ActivateAccount.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ActivateAccount() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleNext = (e) => {
    e.preventDefault();
    localStorage.setItem('pendingUsername', username);
    localStorage.setItem('pendingEmail', email);
    navigate('/auth/verify-code');
  };

  return (
    <form onSubmit={handleNext}>
      <h2>🧑 Aktifkan Akun</h2>
      <input
        type="text"
        placeholder="Nama pengguna"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email kamu"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Lanjut</button>
    </form>
  );
}
