// src/pages/Sidebar.js
import React, { useEffect, useState } from 'react';
import './Sidebar.css';
import { auth, db } from '../../firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  getDoc
} from 'firebase/firestore';

export default function Sidebar({ username, bio, role }) {
  const [groups, setGroups] = useState([]);
  const uid = auth.currentUser?.uid;

  // Ambil grup yang user ikuti
  useEffect(() => {
    if (!uid) return;
    const q = query(collection(db, 'groups'), where('members', 'array-contains', uid));
    const unsub = onSnapshot(q, (snapshot) => {
      setGroups(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [uid]);

  // Buat grup baru
  const handleCreateGroup = async () => {
    const name = prompt('🛠️ Nama grup baru:');
    if (!name || !uid) return;
    await addDoc(collection(db, 'groups'), {
      name,
      members: [uid],
      admins: [uid],
      createdAt: new Date()
    });
  };

  // Hapus grup (hanya admin)
  const handleDeleteGroup = async (groupId) => {
    const confirm = window.confirm('Yakin mau hapus grup ini?');
    if (!confirm) return;

    const groupRef = doc(db, 'groups', groupId);
    const groupSnap = await getDoc(groupRef);
    const data = groupSnap.data();

    if (!data.admins.includes(uid)) {
      alert('❌ Kamu bukan admin grup ini!');
      return;
    }

    await deleteDoc(groupRef);
    alert('🗑️ Grup berhasil dihapus');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-profile">
        <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${username}`} alt="Avatar" />
        <h3>{username}</h3>
        <p>{bio || 'Belum ada bio 😅'}</p>
        <span className={`role-badge ${role}`}>{role}</span>
      </div>

      <div className="sidebar-search">
        <input type="text" placeholder="🔍 Cari user chat..." />
      </div>

      <div className="sidebar-groups">
        <h4>👥 Grup Kamu</h4>
        <ul>
          {groups.map(group => (
            <li key={group.id}>
              <span>{group.name}</span>
              {group.admins.includes(uid) && (
                <button onClick={() => handleDeleteGroup(group.id)}>🗑️</button>
              )}
            </li>
          ))}
        </ul>
        <button onClick={handleCreateGroup}>➕ Buat Grup</button>
      </div>
    </div>
  );
}
