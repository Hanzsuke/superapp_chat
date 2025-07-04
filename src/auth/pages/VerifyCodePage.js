import React, { useState } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';

export default function VerifyCodePage() {
  const [email, setEmail] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const userRef = doc(db, 'pendingUsers', email);
      const snapshot = await getDoc(userRef);

      if (snapshot.exists()) {
        const data = snapshot.data();
        const storedCode = data.code;
        const username = data.username;

        if (codeInput === storedCode) {
          setMessage('✅ Kode cocok! Melanjutkan...');
          setTimeout(() => {
            navigate('/auth/set-password', {
              state: { email, username }
            });
          }, 1200);
        } else {
          setMessage('❌ Kode tidak cocok. Coba lagi.');
        }
      } else {
        setMessage('⚠️ Email tidak terdaftar.');
      }
    } catch (err) {
      console.error('Gagal verifikasi:', err);
      setMessage('❌ Terjadi kesalahan saat verifikasi.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🔑 Verifikasi Kode</h2>
      <form onSubmit={handleVerify}>
        <input
          type="email"
          placeholder="Masukkan email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Masukkan kode verifikasi"
          value={codeInput}
          onChange={(e) => setCodeInput(e.target.value)}
          required
        />
        <button type="submit">Verifikasi</button>
      </form>
      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
}
