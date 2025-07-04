import React, { useState } from 'react';
import './DevConsole.css';

export default function DevConsole({ onCommand }) {
  const [cmd, setCmd] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cmd.trim()) return;
    onCommand(cmd);
    setCmd('');
  };

  return (
    <div className="dev-console">
      <h3>🛠️ Developer Console</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tulis perintah: ubah warna jadi gelap"
          value={cmd}
          onChange={(e) => setCmd(e.target.value)}
        />
        <button type="submit">Jalankan</button>
      </form>
    </div>
  );
}
