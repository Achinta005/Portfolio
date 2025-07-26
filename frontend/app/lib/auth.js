"use client";

// You will need to install jwt-decode to inspect the token
// Run: npm install jwt-decode
import { jwtDecode } from 'jwt-decode';

/**
 * Saves the authentication token to localStorage.
 * @param {string} token - The JWT received from the server.
 */
export const setAuthToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

/**
 * Retrieves the authentication token from localStorage.
 * @returns {string|null} The token, or null if not found.
 */
export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

/**
 * Removes the authentication token from localStorage.
 */
export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token;
};

/**
 * Gets user data by decoding the JWT from localStorage and checks for expiration.
 * This is the most significant upgrade.
 * @returns {object|null} The user payload ({ userId, username, role }) or null if token is missing, invalid, or expired.
 */
export const getUserFromToken = () => {
  const token = getAuthToken();
  if (!token) {
    return null;
  }

  try {
    const decoded = jwtDecode(token);

    // Check if the token's expiration time (in seconds) is in the past
    if (decoded.exp * 1000 < Date.now()) {
      removeAuthToken(); // Clean up the expired token
      return null;
    }

    // If token is valid, return the user data from its payload
    return {
      userId: decoded.userId,
      username: decoded.username,
      role: decoded.role,
    };
  } catch (error) {
    console.error("Failed to decode token:", error);
    removeAuthToken(); // The token is malformed or invalid, so remove it
    return null;
  }
};
