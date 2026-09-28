import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateToken, decodeToken, isTokenExpired } from '../utils/jwt';

const TOKEN_KEY = 'jwt_auth_system_token';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize Auth state from localStorage on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (storedToken) {
        if (!isTokenExpired(storedToken)) {
          const decoded = decodeToken(storedToken);
          if (decoded && decoded.payload) {
            setToken(storedToken);
            setUser({
              userId: decoded.payload.userId,
              username: decoded.payload.username,
              role: decoded.payload.role,
              iat: decoded.payload.iat,
              exp: decoded.payload.exp
            });
          } else {
            // Invalid structure
            localStorage.removeItem(TOKEN_KEY);
          }
        } else {
          // Token expired
          localStorage.removeItem(TOKEN_KEY);
        }
      }
    } catch (err) {
      console.error('Failed to restore auth session:', err);
      localStorage.removeItem(TOKEN_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  // Periodic check for token expiration
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      if (isTokenExpired(token)) {
        logout('Session expired. Please log in again.');
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [token]);

  /**
   * Perform user login
   * @param {string} username 
   * @param {string} password 
   * @param {string} role 
   */
  const login = async (username, password, selectedRole = 'User') => {
    setAuthError(null);

    // Simulate network delay for realism
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (!username || !username.trim()) {
      setAuthError('Username is required.');
      return false;
    }

    if (!password || !password.trim()) {
      setAuthError('Password is required.');
      return false;
    }

    // Determine user ID and role based on input or selection
    const sanitizedUsername = username.trim();
    let finalRole = selectedRole;

    // Auto-detect role from username if not explicitly set
    if (sanitizedUsername.toLowerCase().includes('admin')) {
      finalRole = 'Admin';
    } else if (sanitizedUsername.toLowerCase().includes('editor')) {
      finalRole = 'Editor';
    }

    const userId = `usr_${Math.floor(100000 + Math.random() * 900000)}`;

    // Generate JWT token containing userId & role
    const newToken = generateToken(userId, sanitizedUsername, finalRole);

    // Store token in localStorage
    localStorage.setItem(TOKEN_KEY, newToken);

    // Decode token to set state
    const decoded = decodeToken(newToken);
    if (decoded && decoded.payload) {
      setToken(newToken);
      setUser({
        userId: decoded.payload.userId,
        username: decoded.payload.username,
        role: decoded.payload.role,
        iat: decoded.payload.iat,
        exp: decoded.payload.exp
      });
      return true;
    } else {
      setAuthError('Failed to encode/decode authentication token.');
      return false;
    }
  };

  /**
   * Perform user logout
   * @param {string} reason Optional notice message
   */
  const logout = (reason = null) => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    if (reason) {
      setAuthError(reason);
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    loading,
    authError,
    setAuthError,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
