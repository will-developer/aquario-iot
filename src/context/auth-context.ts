import { createContext } from 'react';

export type AuthContextValue = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  loginWithGoogle: () => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
