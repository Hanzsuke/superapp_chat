import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

/**
 * ProtectedRoute untuk menjaga akses halaman.
 * Bisa juga menerima props role agar hanya role tertentu yang bisa akses.
 *
 * @param {ReactNode} children - Halaman yang akan ditampilkan jika authorized
 * @param {string} requiredRole - Opsional, misalnya "developer"
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div style={styles.loading}>
        <div className="spinner" style={styles.spinner}></div>
        <p>Memuat akses halaman...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  // Jika requiredRole di-set, bisa tambahkan pengecekan di Firestore (lihat Catatan di bawah)
  return children;
}

const styles = {
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '80px',
    color: '#555',
  },
  spinner: {
    width: '30px',
    height: '30px',
    border: '4px solid #ccc',
    borderTop: '4px solid #007bff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '10px',
  }
};
