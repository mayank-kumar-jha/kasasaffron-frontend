import axios from 'axios';

// Base API client — uses VITE_API_URL if set (production), otherwise defaults to proxy
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/v1` : '/api/v1',
  withCredentials: true, // include httpOnly cookies (JWT)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token from localStorage as Authorization header if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kasa_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercept 401 responses — try to refresh token automatically
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/v1/auth/refresh-token` : '/api/v1/auth/refresh-token';
        const { data } = await axios.post(refreshUrl, {}, { withCredentials: true });
        const newToken = data?.data?.accessToken;
        if (newToken) {
          localStorage.setItem('kasa_access_token', newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch {
        // Refresh failed — clear token and redirect to login
        localStorage.removeItem('kasa_access_token');
        localStorage.removeItem('kasa_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
