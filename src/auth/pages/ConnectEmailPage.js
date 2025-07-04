// src/auth/pages/ConnectEmailPage.js
import React, { useState } from 'react';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase'; // pastikan path sesuai strukturmu

export default function ConnectEmailPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      setSending(true);
      await setDoc(doc(db, 'pendingUsers', email), {
        username,
        email,
        code,
        createdAt: serverTimestamp()
      });

      console.log(`Kode verifikasi untuk ${email}: ${code}`);
      setMessage('Kode berhasil dikirim (cek console untuk testing)');
    } catch (err) {
      console.error(err);
      setMessage('Gagal kirim data. Coba lagi.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>✨ Registrasi</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ display: 'block', marginBottom: '1rem' }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: 'block', marginBottom: '1rem' }}
        />
        <button type="submit" disabled={sending}>
          {sending ? 'Mengirim...' : 'Kirim Kode'}
        </button>
      </form>
      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
}
