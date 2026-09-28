/**
 * Helper utilities for simulated JWT creation, encoding, decoding, and validation.
 * 
 * JWT Structure: header.payload.signature
 * - Header: Base64Url JSON describing algorithm and token type
 * - Payload: Base64Url JSON containing userId, username, role, issuedAt (iat), and expiration (exp)
 * - Signature: Base64Url representation of mock HMAC secret signature
 */

// Base64Url Encode
function base64UrlEncode(str) {
  return btoa(str)
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

// Base64Url Decode
function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  try {
    return atob(base64);
  } catch (err) {
    console.error('Failed to decode Base64 string:', err);
    return null;
  }
}

/**
 * Generate a simulated JWT token containing userId and role
 * @param {string} userId - Unique identifier for the user
 * @param {string} username - User's display name
 * @param {string} role - User role (e.g. 'Admin', 'Editor', 'User')
 * @param {number} expiresInSeconds - Token validity duration in seconds (default 3600 = 1 hour)
 * @returns {string} - Simulated JWT string
 */
export function generateToken(userId, username, role, expiresInSeconds = 3600) {
  const now = Math.floor(Date.now() / 1000);

  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const payload = {
    userId: userId || `usr_${Math.floor(100000 + Math.random() * 900000)}`,
    username: username || 'anonymous',
    role: role || 'User',
    iat: now,
    exp: now + expiresInSeconds,
    iss: 'react-jwt-auth-system'
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  
  // Simulated signature generated using header + payload + secret key representation
  const secretKey = 'simulated_super_secret_key_react_auth_demo';
  const mockSignatureRaw = `${encodedHeader}.${encodedPayload}.${secretKey}`;
  const encodedSignature = base64UrlEncode(mockSignatureRaw).substring(0, 32);

  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

/**
 * Decode a simulated JWT token into header, payload, and signature
 * @param {string} token 
 * @returns {object|null}
 */
export function decodeToken(token) {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const rawHeader = base64UrlDecode(parts[0]);
    const rawPayload = base64UrlDecode(parts[1]);

    const header = rawHeader ? JSON.parse(rawHeader) : null;
    const payload = rawPayload ? JSON.parse(rawPayload) : null;

    return {
      header,
      payload,
      signature: parts[2],
      raw: {
        headerPart: parts[0],
        payloadPart: parts[1],
        signaturePart: parts[2]
      }
    };
  } catch (err) {
    console.error('Invalid token format:', err);
    return null;
  }
}

/**
 * Check if the given token is expired
 * @param {string} token 
 * @returns {boolean}
 */
export function isTokenExpired(token) {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.payload || !decoded.payload.exp) {
    return true;
  }

  const now = Math.floor(Date.now() / 1000);
  return decoded.payload.exp < now;
}

/**
 * Format remaining expiration time in human readable form
 * @param {number} expTimestamp 
 * @returns {string}
 */
export function getRemainingTime(expTimestamp) {
  if (!expTimestamp) return 'Expired';
  const now = Math.floor(Date.now() / 1000);
  const diff = expTimestamp - now;

  if (diff <= 0) return 'Expired';

  const minutes = Math.floor(diff / 60);
  const seconds = diff % 60;
  return `${minutes}m ${seconds}s`;
}
