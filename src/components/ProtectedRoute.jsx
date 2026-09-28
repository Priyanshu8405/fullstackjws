import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LoginForm } from './LoginForm';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="full-screen-loader">
        <div className="spinner-large"></div>
        <p>Verifying authentication token...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return children;
};
