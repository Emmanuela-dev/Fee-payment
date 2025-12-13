import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <p>Loading...</p>;
    }

    return user ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;