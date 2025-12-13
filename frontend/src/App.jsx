import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import AdminLogin from './components/AdminLogin';
import ParentDashboard from './components/ParentDashboard';
import AdminDashboard from './components/AdminDashboard';
import Payment from './components/Payment';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          user
            ? user.role === 'ADMIN'
              ? <Navigate to="/admin/dashboard" />
              : <Navigate to="/dashboard" />
            : <Navigate to="/login" />
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <ParentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment"
        element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppContent />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
