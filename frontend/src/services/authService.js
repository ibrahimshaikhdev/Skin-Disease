import api, { setAuth, clearAuth, getStoredUser, getToken } from './api';

export async function login(username, password) {
  const { data } = await api.post('/auth/login', { username, password });
  setAuth(data.token, data.username);
  return data;
}

export async function register(username, password) {
  const { data } = await api.post('/auth/register', { username, password });
  setAuth(data.token, data.username);
  return data;
}

export function logout() {
  clearAuth();
}

export function currentUser() {
  return getToken() ? getStoredUser() : null;
}

export function isAuthenticated() {
  return !!getToken();
}
