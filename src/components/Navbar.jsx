import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, LogOut, UserCheck, Key, Lock, Unlock } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const getRoleBadgeClass = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'badge-admin';
      case 'editor':
        return 'badge-editor';
      default:
        return 'badge-user';
    }
  };

  return (
    <nav className="navbar glass-nav">
      <div className="nav-container">
        <div className="nav-brand">
          <div className="brand-logo">
            <ShieldCheck size={24} />
          </div>
          <div className="brand-text">
            <span className="brand-title">JWT Auth App</span>
            <span className="brand-sub">React Authentication System</span>
          </div>
        </div>

        <div className="nav-actions">
          {isAuthenticated ? (
            <div className="user-profile-bar">
              <div className="status-indicator online">
                <span className="ping"></span>
                <span className="dot"></span>
                <span className="status-text">Authenticated</span>
              </div>

              <div className="user-info-chip">
                <UserCheck size={16} className="user-icon" />
                <span className="username-display">{user.username}</span>
                <span className={`role-pill ${getRoleBadgeClass(user.role)}`}>
                  {user.role}
                </span>
              </div>

              <button 
                onClick={() => logout('You have been logged out.')} 
                className="btn-logout"
                title="Log out and clear stored JWT token"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="status-indicator offline">
              <Lock size={14} />
              <span>Protected Route Locked</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
