import axios from 'axios';

// All requests go through the Spring Boot gateway (proxied in dev via Vite).
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')}/api`
  : '/api';

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 60000,
});

const TOKEN_KEY = 'dermacare_token';
const USER_KEY = 'dermacare_user';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
  return localStorage.getItem(USER_KEY);
}

export function setAuth(token, username) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, username);
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// Attach the JWT to every request when present.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, drop stale credentials so the UI can prompt for login again.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      clearAuth();
    }
    return Promise.reject(err);
  }
);

export default api;
