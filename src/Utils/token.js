// src/utils/token.js

// Set token in localStorage
export const setToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('RCI6IkpXVCJ9', token);
  }
};

// Get token from localStorage
export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('RCI6IkpXVCJ9');
  }
  return null;
};

// Remove token from localStorage
export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('RCI6IkpXVCJ9');
  }
};

// Validate token based on expiry (exp field in JWT)
export const isTokenValid = (token) => {
  if (!token) return false;

  try {
    // Check if running in browser environment
    if (typeof window === 'undefined') return false;

    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const payload = JSON.parse(window.atob(parts[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    return payload.exp && payload.exp > currentTime;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

// Decode token to get user data
export const decodeToken = (token) => {
  if (!token) return null;

  try {
    if (typeof window === 'undefined') return null;
    return JSON.parse(window.atob(token.split('.')[1]));
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
};
