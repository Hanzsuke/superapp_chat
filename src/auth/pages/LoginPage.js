// src/auth/pages/LoginPage.js
import React, { useState } from 'react';
import { auth, db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './login.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [resetMsg, setResetMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const q = query(collection(db, 'users'), where('username', '==', username));
      const snap = await getDocs(q);

      if (snap.empty) return setMsg('❌ Username tidak ditemukan');

      const email = snap.docs[0].data().email;
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setMsg('⚠️ Username atau password salah');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetMsg('');

    if (!username) return setResetMsg('⚠️ Masukkan username dulu');

    try {
      const q = query(collection(db, 'users'), where('username', '==', username));
      const snap = await getDocs(q);

      if (snap.empty) return setResetMsg('❌ Username tidak ditemukan');

      const email = snap.docs[0].data().email;
      await sendPasswordResetEmail(auth, email);
      setResetMsg(`📩 Link reset dikirim ke ${email}`);
    } catch (err) {
      console.error(err);
      setResetMsg('❌ Gagal mengirim reset email');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box glass">
        <h2>🔐 Selamat Datang</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Masuk</button>
        </form>
        {msg && <p>{msg}</p>}

        <p style={{ marginTop: '1rem' }}>
          <a href="#" onClick={handleResetPassword} style={{ color: '#38bdf8' }}>
            Lupa password?
          </a>
        </p>
        {resetMsg && <p>{resetMsg}</p>}
      </div>
    </div>
  );
}
