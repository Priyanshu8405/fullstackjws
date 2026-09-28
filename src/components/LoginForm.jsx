import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Lock, 
  User, 
  ShieldCheck, 
  Key, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const LoginForm = () => {
  const { login, authError, setAuthError } = useAuth();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick preset demo accounts
  const presets = [
    { name: 'Admin Account', user: 'admin_alex', pass: 'admin123', role: 'Admin', badgeClass: 'badge-admin' },
    { name: 'Editor Account', user: 'editor_sarah', pass: 'editor123', role: 'Editor', badgeClass: 'badge-editor' },
    { name: 'User Account', user: 'user_john', pass: 'user123', role: 'User', badgeClass: 'badge-user' }
  ];

  const handleApplyPreset = (preset) => {
    setUsername(preset.user);
    setPassword(preset.pass);
    setRole(preset.role);
    if (authError) setAuthError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await login(username, password, role);
    setIsSubmitting(false);
  };

  return (
    <div className="login-container">
      <div className="login-card glass-panel">
        <div className="login-header">
          <div className="brand-badge">
            <ShieldCheck size={28} className="brand-icon" />
          </div>
          <h2>Welcome Back</h2>
          <p className="subtitle">Sign in to generate your JWT token and access the protected dashboard.</p>
        </div>

        {authError && (
          <div className="alert-banner alert-error">
            <AlertCircle size={18} />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">
              <User size={16} /> Username
            </label>
            <div className="input-wrapper">
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (authError) setAuthError(null);
                }}
                placeholder="Enter your username (e.g. admin_alex)"
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <Lock size={16} /> Password
            </label>
            <div className="input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (authError) setAuthError(null);
                }}
                placeholder="Enter password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="role-select">
              <Key size={16} /> Select User Role (Simulated Payload)
            </label>
            <select
              id="role-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="role-dropdown"
            >
              <option value="User">Standard User (Basic Access)</option>
              <option value="Editor">Editor (Content Management)</option>
              <option value="Admin">Administrator (Full Access)</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="btn-primary submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="spinner-wrapper">
                <span className="spinner"></span> Generating JWT...
              </span>
            ) : (
              <>
                <span>Log In & Issue Token</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="divider">
          <span>Quick Demo Login Presets</span>
        </div>

        <div className="presets-grid">
          {presets.map((p) => (
            <button
              key={p.role}
              type="button"
              className={`preset-card ${role === p.role ? 'preset-active' : ''}`}
              onClick={() => handleApplyPreset(p)}
            >
              <div className="preset-top">
                <span className={`role-pill ${p.badgeClass}`}>{p.role}</span>
                {username === p.user && <CheckCircle2 size={14} className="check-icon" />}
              </div>
              <div className="preset-details">
                <span className="preset-user">{p.user}</span>
                <span className="preset-pass">Pass: {p.pass}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="login-footer">
          <p>
            <Sparkles size={14} className="sparkle-icon" />
            Upon login, a signed JWT token containing <code>userId</code> and <code>role</code> will be stored in <code>localStorage</code>.
          </p>
        </div>
      </div>
    </div>
  );
};
