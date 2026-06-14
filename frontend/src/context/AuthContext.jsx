import { createContext, useContext, useState, useCallback } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.currentUser());

  const login = useCallback(async (username, password) => {
    const data = await authService.login(username, password);
    setUser(data.username);
    return data;
  }, []);

  const register = useCallback(async (username, password) => {
    const data = await authService.register(username, password);
    setUser(data.username);
    return data;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
