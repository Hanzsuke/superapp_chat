import React, { useState } from 'react';
import { auth, db } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './dev-login.css'; // styling terpisah

export default function DevLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg('');

    try {
      // Login ke Firebase Auth
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      // Ambil data Firestore user
      const userSnap = await getDoc(doc(db, 'users', uid));

      if (!userSnap.exists()) {
        return setMsg('❌ Akun tidak ditemukan di database.');
      }

      const role = userSnap.data().role;

      if (role !== 'developer') {
        return setMsg('🚫 Akses ditolak. Bukan akun developer.');
      }

      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setMsg('❌ Email atau password salah.');
    }
  };

  return (
    <div className="dev-login-container">
      <div className="dev-login-box">
        <h2>🛠️ Developer Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Developer"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Masuk Developer</button>
        </form>
        {msg && <p style={{ marginTop: '1rem' }}>{msg}</p>}
      </div>
    </div>
  );
}
