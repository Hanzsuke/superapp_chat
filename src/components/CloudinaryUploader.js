// src/components/CloudinaryUploader.js
import React, { useState } from 'react';
import { auth } from '../firebase';

export default function CloudinaryUploader({ onUpload }) {
  const [preview, setPreview] = useState(null);
  const uid = auth.currentUser?.uid;

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !uid) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'unsigned_upload'); // preset kamu
    formData.append('folder', `users/${uid}`); // folder dinamis

    const res = await fetch(`https://api.cloudinary.com/v1_1/<do6ggdfao>/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setPreview(data.secure_url);
    onUpload(data.secure_url); // kirim URL ke parent (chat)
  };

  return (
    <div>
      <input type="file" accept="image/*,video/*" onChange={handleUpload} />
      {preview && (
        <div style={{ marginTop: '1rem' }}>
          <a href={preview} target="_blank" rel="noreferrer">📎 Lihat File</a>
        </div>
      )}
    </div>
  );
}
