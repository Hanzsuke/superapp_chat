// src/pages/dashboard/Dashboard.js
import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

// Komponen dashboard
import Sidebar from './Sidebar';
import DevPanel from './DevPanel';
import UserPanel from './UserPanel'; 

// Style
import './Dashboard.css';

export default function Dashboard() {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/auth');
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserInfo(userDoc.data());
        } else {
          console.warn('⚠️ Dokumen user tidak ditemukan di Firestore.');
        }
      } catch (err) {
        console.error('❌ Gagal mengambil data user:', err);
      }
    });

    return () => unsub();
  }, [navigate]);

  if (!userInfo) {
    return <div className="dashboard-loading">⏳ Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-layout">
      <Sidebar
        username={userInfo.username}
        bio={userInfo.bio}
        role={userInfo.role}
      />

      <div className="dashboard-content">
        <h1>👋 Selamat datang, {userInfo.username}</h1>
        <p>Role kamu: <strong>{userInfo.role}</strong></p>

        {/* Panel sesuai peran */}
        {userInfo.role === 'developer' ? <DevPanel /> : <UserPanel />}

        <div style={{ marginTop: '2rem' }}>
          <button onClick={() => navigate('/ai-assistant')}>🤖 Buka AI Assistant</button>
        </div>
      </div>
    </div>
  );
}
