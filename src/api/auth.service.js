import api from './client.js';

/**
 * Register a new customer account
 */
export const register = async ({ name, email, password }) => {
  const { data } = await api.post('/auth/register', { name, email, password });
  return data;
};

/**
 * Login with email + password.
 * On success, stores access token and user info in localStorage.
 */
export const login = async ({ email, password }) => {
  const { data } = await api.post('/auth/login', { email, password });
  if (data?.data?.accessToken) {
    localStorage.setItem('kasa_access_token', data.data.accessToken);
    localStorage.setItem('kasa_user', JSON.stringify(data.data.user));
    window.dispatchEvent(new Event('userStateChange'));
  }
  return data;
};

/**
 * Logout — clears local state and calls server to invalidate refresh token.
 */
export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } finally {
    localStorage.removeItem('kasa_access_token');
    localStorage.removeItem('kasa_user');
    window.dispatchEvent(new Event('userStateChange'));
  }
};

/**
 * Get the currently logged-in user from localStorage (fast, no network call).
 */
export const getCurrentUserLocal = () => {
  try {
    const user = localStorage.getItem('kasa_user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

/**
 * Fetch current user from server (to verify token is still valid).
 */
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const forgotPassword = async (data) => {
  const response = await api.post('/auth/forgot-password', data);
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await api.post('/auth/reset-password', data);
  return response.data;
};

/**
 * Check if user is logged in and is an admin.
 */
export const isAdmin = () => {
  const user = getCurrentUserLocal();
  return user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' || user?.role === 'MANAGER';
};
