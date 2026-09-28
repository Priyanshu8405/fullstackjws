import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { decodeToken, getRemainingTime } from '../utils/jwt';
import { 
  Shield, 
  User, 
  Key, 
  Clock, 
  Copy, 
  Check, 
  Cpu, 
  Database, 
  FileText, 
  Settings, 
  Users, 
  Activity, 
  Lock, 
  Code2, 
  Layers,
  Terminal,
  Trash2,
  ExternalLink
} from 'lucide-react';

export const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRemaining, setTimeRemaining] = useState('');
  
  const decoded = decodeToken(token);

  useEffect(() => {
    if (!user || !user.exp) return;

    const updateTimer = () => {
      setTimeRemaining(getRemainingTime(user.exp));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [user]);

  const handleCopyToken = () => {
    if (!token) return;
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
    <div className="dashboard-container">
      {/* Dashboard Top Banner */}
      <div className="dashboard-hero glass-panel">
        <div className="hero-content">
          <div className="hero-welcome">
            <span className="welcome-tag">
              <Shield size={14} /> Protected Route Active
            </span>
            <h1>Dashboard Overview</h1>
            <p className="hero-subtitle">
              Welcome back, <strong className="user-highlight">{user.username}</strong>! You are successfully authenticated.
            </p>
          </div>

          <div className="role-summary-card">
            <div className="role-summary-header">
              <span className="label">Assigned User Role</span>
              <span className={`role-pill ${getRoleBadgeClass(user.role)}`}>
                {user.role}
              </span>
            </div>
            <div className="role-summary-body">
              <div className="summary-item">
                <span className="item-label">User ID:</span>
                <code className="item-value">{user.userId}</code>
              </div>
              <div className="summary-item">
                <span className="item-label">Session Expires:</span>
                <span className="item-value timer-badge">
                  <Clock size={13} /> {timeRemaining}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Activity size={16} /> User Profile & Role Info
        </button>
        <button
          className={`tab-btn ${activeTab === 'jwt' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('jwt')}
        >
          <Code2 size={16} /> JWT Inspector & Storage
        </button>
        {user.role === 'Admin' && (
          <button
            className={`tab-btn ${activeTab === 'admin' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            <Users size={16} /> Admin Controls
          </button>
        )}
        {(user.role === 'Admin' || user.role === 'Editor') && (
          <button
            className={`tab-btn ${activeTab === 'editor' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('editor')}
          >
            <FileText size={16} /> Content Studio
          </button>
        )}
      </div>

      {/* TAB 1: OVERVIEW & USER ROLE */}
      {activeTab === 'overview' && (
        <div className="tab-content fade-in">
          <div className="stats-grid">
            <div className="stat-card glass-panel">
              <div className="stat-icon icon-blue">
                <User size={22} />
              </div>
              <div className="stat-info">
                <span className="stat-title">User ID</span>
                <span className="stat-value font-mono">{user.userId}</span>
                <span className="stat-sub">Unique user identifier</span>
              </div>
            </div>

            <div className="stat-card glass-panel">
              <div className="stat-icon icon-purple">
                <Key size={22} />
              </div>
              <div className="stat-info">
                <span className="stat-title">Active Role</span>
                <div className="role-display-row">
                  <span className={`role-pill ${getRoleBadgeClass(user.role)}`}>
                    {user.role}
                  </span>
                </div>
                <span className="stat-sub">Permissions embedded in JWT</span>
              </div>
            </div>

            <div className="stat-card glass-panel">
              <div className="stat-icon icon-green">
                <Database size={22} />
              </div>
              <div className="stat-info">
                <span className="stat-title">Token Storage</span>
                <span className="stat-value text-green">localStorage</span>
                <span className="stat-sub">Key: <code>jwt_auth_system_token</code></span>
              </div>
            </div>

            <div className="stat-card glass-panel">
              <div className="stat-icon icon-amber">
                <Clock size={22} />
              </div>
              <div className="stat-info">
                <span className="stat-title">Session TTL</span>
                <span className="stat-value font-mono text-amber">{timeRemaining}</span>
                <span className="stat-sub">Auto refresh / expiry check</span>
              </div>
            </div>
          </div>

          <div className="panel-row">
            <div className="info-card glass-panel flex-1">
              <div className="card-header">
                <h3><Shield size={18} /> Authentication Summary</h3>
              </div>
              <div className="card-body">
                <p className="card-desc">
                  You are logged into a protected React route. Your authentication status is verified using a client-side simulated JWT token stored in <code>localStorage</code>.
                </p>

                <div className="details-table">
                  <div className="table-row">
                    <span className="row-key">Username</span>
                    <span className="row-val font-semibold">{user.username}</span>
                  </div>
                  <div className="table-row">
                    <span className="row-key">Assigned Role</span>
                    <span className="row-val">
                      <span className={`role-pill ${getRoleBadgeClass(user.role)}`}>
                        {user.role}
                      </span>
                    </span>
                  </div>
                  <div className="table-row">
                    <span className="row-key">Issued At (iat)</span>
                    <span className="row-val font-mono">
                      {user.iat ? new Date(user.iat * 1000).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                  <div className="table-row">
                    <span className="row-key">Expiration (exp)</span>
                    <span className="row-val font-mono">
                      {user.exp ? new Date(user.exp * 1000).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                  <div className="table-row">
                    <span className="row-key">Algorithm</span>
                    <span className="row-val font-mono">HS256 (HMAC SHA-256)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="info-card glass-panel flex-1">
              <div className="card-header">
                <h3><Layers size={18} /> Role Privileges</h3>
              </div>
              <div className="card-body">
                <div className="privileges-list">
                  <div className={`privilege-item ${user.role === 'Admin' || user.role === 'Editor' || user.role === 'User' ? 'active' : 'disabled'}`}>
                    <span className="priv-icon">✓</span>
                    <div>
                      <strong>Access Protected Dashboard</strong>
                      <p>View authenticated routes and session details.</p>
                    </div>
                  </div>

                  <div className={`privilege-item ${user.role === 'Admin' || user.role === 'Editor' ? 'active' : 'disabled'}`}>
                    <span className="priv-icon">{user.role === 'Admin' || user.role === 'Editor' ? '✓' : '✕'}</span>
                    <div>
                      <strong>Content Management Studio</strong>
                      <p>Create, edit, and publish content articles (Editor & Admin only).</p>
                    </div>
                  </div>

                  <div className={`privilege-item ${user.role === 'Admin' ? 'active' : 'disabled'}`}>
                    <span className="priv-icon">{user.role === 'Admin' ? '✓' : '✕'}</span>
                    <div>
                      <strong>System Administration</strong>
                      <p>Manage users, issue roles, inspect audit logs (Admin only).</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: JWT INSPECTOR */}
      {activeTab === 'jwt' && (
        <div className="tab-content fade-in">
          <div className="info-card glass-panel">
            <div className="card-header border-b">
              <div>
                <h3><Code2 size={20} /> JWT Token Inspector</h3>
                <p className="card-sub">
                  Inspect the 3 distinct base64-url encoded segments of your current JSON Web Token.
                </p>
              </div>
              <button onClick={handleCopyToken} className="btn-secondary">
                {copied ? <Check size={16} className="text-green" /> : <Copy size={16} />}
                <span>{copied ? 'Copied Token!' : 'Copy Full JWT'}</span>
              </button>
            </div>

            <div className="card-body">
              <div className="jwt-visualizer">
                <span className="jwt-label">Raw JWT Token Structure (Header . Payload . Signature):</span>
                <div className="jwt-token-box">
                  <span className="jwt-part-header">{decoded?.raw?.headerPart || 'header'}</span>
                  <span className="jwt-dot">.</span>
                  <span className="jwt-part-payload">{decoded?.raw?.payloadPart || 'payload'}</span>
                  <span className="jwt-dot">.</span>
                  <span className="jwt-part-signature">{decoded?.raw?.signaturePart || 'signature'}</span>
                </div>
              </div>

              <div className="jwt-breakdown-grid">
                {/* Header JSON */}
                <div className="jwt-card jwt-card-header">
                  <div className="jwt-card-title">
                    <span className="dot-badge bg-red"></span>
                    <span>1. Header (Algorithm & Token Type)</span>
                  </div>
                  <pre className="code-block">
                    {JSON.stringify(decoded?.header, null, 2)}
                  </pre>
                </div>

                {/* Payload JSON */}
                <div className="jwt-card jwt-card-payload">
                  <div className="jwt-card-title">
                    <span className="dot-badge bg-purple"></span>
                    <span>2. Payload (Claims: userId & role)</span>
                  </div>
                  <pre className="code-block">
                    {JSON.stringify(decoded?.payload, null, 2)}
                  </pre>
                </div>

                {/* Signature */}
                <div className="jwt-card jwt-card-signature">
                  <div className="jwt-card-title">
                    <span className="dot-badge bg-blue"></span>
                    <span>3. Signature (Verification Hash)</span>
                  </div>
                  <div className="signature-box">
                    <code>{decoded?.signature}</code>
                    <p className="sig-note">
                      HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)
                    </p>
                  </div>
                </div>
              </div>

              <div className="storage-inspector">
                <div className="storage-header">
                  <Database size={18} />
                  <span>Token Storage Verification</span>
                </div>
                <div className="storage-details">
                  <div className="storage-row">
                    <span className="key font-mono">Storage Engine:</span>
                    <span className="val">Browser LocalStorage API</span>
                  </div>
                  <div className="storage-row">
                    <span className="key font-mono">Key Name:</span>
                    <code className="val highlight">jwt_auth_system_token</code>
                  </div>
                  <div className="storage-row">
                    <span className="key font-mono">Value:</span>
                    <span className="val token-preview font-mono">{token}</span>
                  </div>
                </div>

                <div className="storage-actions">
                  <button 
                    onClick={() => logout('Token cleared manually from storage test.')} 
                    className="btn-danger"
                  >
                    <Trash2 size={16} />
                    <span>Clear Token from localStorage & Test Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ADMIN CONTROLS (Only visible to Admin) */}
      {activeTab === 'admin' && user.role === 'Admin' && (
        <div className="tab-content fade-in">
          <div className="info-card glass-panel">
            <div className="card-header border-b">
              <h3><Users size={20} /> Administrator Control Panel</h3>
              <span className="role-pill badge-admin">Admin Privileges Active</span>
            </div>
            <div className="card-body">
              <p className="card-desc">
                This section is protected by role-based authorization rules. Only users with <code>role: "Admin"</code> in their decoded JWT payload can view this module.
              </p>

              <div className="admin-demo-grid">
                <div className="admin-widget">
                  <h4><Activity size={16} /> System Audit Logs</h4>
                  <ul className="audit-list">
                    <li>
                      <span className="time">10:04 AM</span>
                      <span className="msg">JWT Issued for user <strong>{user.username}</strong> ({user.userId})</span>
                    </li>
                    <li>
                      <span className="time">10:02 AM</span>
                      <span className="msg">Token storage validated in <code>localStorage</code></span>
                    </li>
                    <li>
                      <span className="time">09:55 AM</span>
                      <span className="msg">Security policies enforced: Algorithm HS256</span>
                    </li>
                  </ul>
                </div>

                <div className="admin-widget">
                  <h4><Settings size={16} /> User Role Management</h4>
                  <table className="demo-table">
                    <thead>
                      <tr>
                        <th>User ID</th>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><code>{user.userId}</code></td>
                        <td>{user.username} (You)</td>
                        <td><span className="role-pill badge-admin">Admin</span></td>
                        <td><span className="status-badge active">Active</span></td>
                      </tr>
                      <tr>
                        <td><code>usr_729401</code></td>
                        <td>editor_sarah</td>
                        <td><span className="role-pill badge-editor">Editor</span></td>
                        <td><span className="status-badge active">Active</span></td>
                      </tr>
                      <tr>
                        <td><code>usr_183920</code></td>
                        <td>user_john</td>
                        <td><span className="role-pill badge-user">User</span></td>
                        <td><span className="status-badge active">Active</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: EDITOR STUDIO (Visible to Admin & Editor) */}
      {activeTab === 'editor' && (user.role === 'Admin' || user.role === 'Editor') && (
        <div className="tab-content fade-in">
          <div className="info-card glass-panel">
            <div className="card-header border-b">
              <h3><FileText size={20} /> Content Studio & Publisher</h3>
              <span className={`role-pill ${getRoleBadgeClass(user.role)}`}>{user.role} Privileges</span>
            </div>
            <div className="card-body">
              <p className="card-desc">
                Accessible to <code>Editor</code> and <code>Admin</code> roles. Standard users cannot view or post here.
              </p>

              <div className="editor-demo-box">
                <div className="editor-toolbar">
                  <button className="tool-btn">Bold</button>
                  <button className="tool-btn">Italic</button>
                  <button className="tool-btn">Code Block</button>
                  <button className="tool-btn">Insert Image</button>
                </div>
                <textarea 
                  className="editor-textarea" 
                  defaultValue={`# Welcome to the Protected Article Studio\n\nThis content is being drafted by ${user.username} (${user.role}).\n\nJWT Claims Verified:\n- userId: ${user.userId}\n- role: ${user.role}`} 
                  rows={6}
                />
                <div className="editor-footer">
                  <button className="btn-primary">Publish Article</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
