// src/pages/UserPanel.js
import React from 'react';

export default function UserPanel() {
  return (
    <div>
      <h2>🎮 Area Pengguna</h2>
      <div className="panel-section">
        <button>🎧 Akses Musik</button>
        <button>💾 Penyimpanan (50GB)</button>
        <button>🎮 Game Interaktif</button>
        <button disabled>🎨 Ganti Wallpaper</button>
      </div>
    </div>
  );
}
