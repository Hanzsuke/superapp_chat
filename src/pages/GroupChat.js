import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  doc,
  getDoc
} from 'firebase/firestore';
import CloudinaryUploader from '../components/CloudinaryUploader';

export default function GroupChat({ groupId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [mediaUrl, setMediaUrl] = useState(null);
  const [role, setRole] = useState('user');
  const uid = auth.currentUser?.uid;

  // Ambil role user
  useEffect(() => {
    const fetchRole = async () => {
      if (!uid) return;
      const docRef = doc(db, 'users', uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setRole(snap.data().role || 'user');
      }
    };
    fetchRole();
  }, [uid]);

  // Ambil pesan dari grup
  useEffect(() => {
    const q = query(collection(db, 'groups', groupId, 'messages'), orderBy('timestamp'));
    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [groupId]);

  // Kirim pesan
  const sendMessage = async () => {
    if (!input.trim() && !mediaUrl) return;

    await addDoc(collection(db, 'groups', groupId, 'messages'), {
      text: input,
      sender: uid,
      timestamp: serverTimestamp(),
      mediaUrl,
    });

    setInput('');
    setMediaUrl(null);
  };

  return (
    <div>
      <h2>💬 Grup Chat</h2>

      <div className="chat-box" style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '1rem' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ marginBottom: '1rem', background: '#f4f4f4', padding: '0.5rem', borderRadius: '8px' }}>
            <strong>{msg.sender}</strong>: {msg.text}
            {msg.mediaUrl && (
              msg.mediaUrl.match(/\.(mp4|webm)$/i) ? (
                <video controls width="250" src={msg.mediaUrl} />
              ) : (
                <img src={msg.mediaUrl} alt="media" style={{ maxWidth: '200px', display: 'block', marginTop: '0.5rem' }} />
              )
            )}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Ketik pesan..."
        style={{ width: '70%', marginRight: '1rem' }}
      />
      <button onClick={sendMessage}>Kirim</button>

      {role === 'admin' && (
        <div style={{ marginTop: '1rem' }}>
          <CloudinaryUploader onUpload={setMediaUrl} />
        </div>
      )}
    </div>
  );
}
