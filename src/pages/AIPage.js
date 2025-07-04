import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function AIPage() {
  const [user, loading] = useAuthState(auth);
  const [role, setRole] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const getUserRole = async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        const snapshot = await getDoc(userRef);
        if (snapshot.exists()) {
          setRole(snapshot.data().role);
        } else {
          console.warn('⚠️ User document not found');
        }
      } catch (err) {
        console.error('❌ Error fetching role:', err);
      }
    };

    if (user) getUserRole();
  }, []); // ✅ This closes the useEffect

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🤖 AI Assistant Playground</h1>
      <p>Role: {role}</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setAiResponse(`AI menerima: "${userInput}"`);
        }}
        style={{ marginTop: '1rem' }}
      >
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Tulis sesuatu..."
        />
        <button type="submit">Kirim</button>
      </form>

      {aiResponse && <p style={{ marginTop: '1rem' }}>{aiResponse}</p>}
    </div>
  );
}
