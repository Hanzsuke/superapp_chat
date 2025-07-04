import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import './AuthPage.css'; // Opsional: styling manual

export default function AuthPage() {
  const [mode, setMode] = useState('login'); // 'login' atau 'register'
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePwd = () => setShowPwd((prev) => !prev);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error) {
      alert(`❌ Login gagal: ${error.message}`);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const isHanz = email === 'haridl.azuan2009@gmail.com';
      const role = isHanz ? 'developer' : 'public';

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        username,
        role,
        createdAt: serverTimestamp()
      });

      alert(`✅ Registrasi berhasil sebagai ${role}.`);
      navigate('/dashboard');
    } catch (error) {
      alert(`❌ Registrasi gagal: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>{mode === 'login' ? '🔐 Login' : '📝 Register'}</h2>
      <div className="auth-toggle">
        <button onClick={() => setMode('login')} disabled={mode === 'login'}>Login</button>
        <button onClick={() => setMode('register')} disabled={mode === 'register'}>Register</button>
      </div>

      <form onSubmit={mode === 'login' ? handleLogin : handleRegister}>
        {mode === 'register' && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="password-wrapper">
          <input
            type={showPwd ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span className="toggle-icon" onClick={togglePwd}>
            {showPwd ? '🙈' : '👁️'}
          </span>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Memproses...' : mode === 'login' ? 'Login' : 'Register'}
        </button>
      </form>
    </div>
  );
}
