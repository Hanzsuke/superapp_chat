import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, setDoc, query, where, getDocs, collection } from 'firebase/firestore';
import { auth, db } from '../../firebase';

export default function SetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const username = location.state?.username;

  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!email || !username) {
      setMessage('❌ Akses tidak valid. Harap verifikasi ulang.');
    }
  }, [email, username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      // Cek apakah akun sudah ada sebelumnya
      const existing = query(collection(db, 'users'), where('email', '==', email));
      const snap = await getDocs(existing);
      if (!snap.empty) return setMessage('⚠️ Akun sudah pernah terdaftar.');

      // 1. Buat akun di Firebase Auth
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      // 2. Simpan data user ke Firestore
      await setDoc(doc(db, 'users', uid), {
        username,
        email,
        role: 'user',
        createdAt: new Date()
      });

      // 3. Login otomatis (fallback, kalau perlu)
      await signInWithEmailAndPassword(auth, email, password);

      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setMessage('❌ Gagal menyimpan data. Ulangi lagi.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🔐 Buat Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Tulis password baru kamu..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Daftarkan Akun</button>
      </form>
      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
}
