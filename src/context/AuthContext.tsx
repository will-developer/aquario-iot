import { useEffect, useMemo, useState, type ReactNode } from 'react';

import { AuthContext } from './auth-context';

const AUTH_STORAGE_KEY = 'aqua-iot-auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  });

  useEffect(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, String(isAuthenticated));
  }, [isAuthenticated]);

  const login = (email: string, password: string) => {
    if (!email.trim() || !password.trim()) {
      return false;
    }

    setIsAuthenticated(true);
    return true;
  };

  const loginWithGoogle = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const value = useMemo(
    () => ({ isAuthenticated, login, loginWithGoogle, logout }),
    [isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
