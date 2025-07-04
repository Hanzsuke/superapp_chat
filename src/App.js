// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';

// Layout
import AuthLayout from './auth/AuthLayout';
import ProtectedRoute from './auth/ProtectedRoute';

// Pages (Auth)
import AuthPage from './auth/pages/AuthPage';
import LoginPage from './auth/pages/LoginPage';
import DevLoginPage from './auth/pages/DevLoginPage';
import ConnectEmailPage from './auth/pages/ConnectEmailPage';
import VerifyCodePage from './auth/pages/VerifyCodePage';
import SetPasswordPage from './auth/pages/SetPasswordPage';
import ActivateAccount from './auth/pages/ActivateAccount';
import EmailStep from './auth/pages/EmailStep';

// Pages (App)
import Dashboard from './pages/dashboard/Dashboard';
import AIPage from './pages/AIPage';
import GroupChat from './pages/GroupChat'; // ✅ Tambahkan ini

// ✅ Wrapper untuk ambil groupId dari URL
function GroupChatWrapper() {
  const { groupId } = useParams();
  return (
    <ProtectedRoute>
      <GroupChat groupId={groupId} />
    </ProtectedRoute>
  );
}

function App() {
  return (
    <Router>
      <Routes>

        {/* 🛡️ Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<AuthPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="dev-login" element={<DevLoginPage />} />
          <Route path="connect-email" element={<ConnectEmailPage />} />
          <Route path="verify-code" element={<VerifyCodePage />} />
          <Route path="set-password" element={<SetPasswordPage />} />
          <Route path="activate" element={<ActivateAccount />} />
          <Route path="email-step" element={<EmailStep />} />
        </Route>

        {/* 🔒 Protected App Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-assistant"
          element={
            <ProtectedRoute>
              <AIPage />
            </ProtectedRoute>
          }
        />

        {/* ✅ Group Chat Route */}
        <Route path="/group/:groupId" element={<GroupChatWrapper />} />

        {/* 🌐 Redirects */}
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />

      </Routes>
    </Router>
  );
}

export default App;
