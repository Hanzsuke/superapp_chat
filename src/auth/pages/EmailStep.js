// src/auth/pages/EmailStep.js
import React, { useState } from 'react';
import { sendSignInLinkToEmail } from 'firebase/auth';
import { auth } from '../../firebase';

export default function EmailStep() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const actionCodeSettings = {
    url: 'https://superapp-9e85d.web.app/auth/set-password',
    handleCodeInApp: true,
  };

  const handleSendLink = async (e) => {
    e.preventDefault();
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      setSent(true);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSendLink}>
      <h2>📧 Kirim Link Aktivasi ke Email</h2>
      <input
        type="email"
        placeholder="Email kamu"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Kirim Link</button>
      {sent && <p>✅ Link terkirim! Cek inbox kamu ya.</p>}
    </form>
  );
}
