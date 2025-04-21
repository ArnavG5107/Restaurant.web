import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
const { user, isAdmin, loading } = useAuth();
const location = useLocation();

if (loading) {
// Show loading spinner while checking authentication
return <div className="loading-spinner">Loading...</div>;
}

if (!user) {
// Redirect to login if not authenticated
return <Navigate to="/login" state={{ from: location }} replace />;
}

if (adminOnly && !isAdmin) {
// Redirect to home if not an admin
return <Navigate to="/" replace />;
}

return children;
};

export default ProtectedRoute;