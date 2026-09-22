import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import { getGoogleClientId } from '../utils/env';
import { loadGoogleIdentity } from '../utils/googleIdentity';
import { AuthContext, type AuthUser } from './auth-context';

const AUTH_STORAGE_KEY = 'aqua-iot-user';
const GOOGLE_SCOPE = 'openid email profile';
const USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const parsed: unknown = JSON.parse(raw);

    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      typeof (parsed as AuthUser).email === 'string'
    ) {
      return parsed as AuthUser;
    }
  } catch {
    // Formato antigo ou corrompido: trata como deslogado.
  }

  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readStoredUser);
  const accessTokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const login = useCallback((email: string, password: string) => {
    if (!email.trim() || !password.trim()) {
      return false;
    }

    setUser({ email, name: email, picture: null });
    return true;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const clientId = getGoogleClientId();

    await loadGoogleIdentity();

    const oauth2 = window.google?.accounts.oauth2;

    if (!oauth2) {
      throw new Error('Google Identity Services indisponivel.');
    }

    const accessToken = await new Promise<string>((resolve, reject) => {
      const client = oauth2.initTokenClient({
        client_id: clientId,
        scope: GOOGLE_SCOPE,
        callback: (response) => {
          if (response.error || !response.access_token) {
            reject(
              new Error(response.error_description ?? 'Login com Google falhou.'),
            );
            return;
          }

          resolve(response.access_token);
        },
        error_callback: () => {
          reject(new Error('Login com Google cancelado.'));
        },
      });

      client.requestAccessToken();
    });

    const response = await fetch(USERINFO_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      throw new Error('Nao foi possivel obter os dados da conta Google.');
    }

    const profile = (await response.json()) as {
      email?: string;
      name?: string;
      picture?: string;
    };

    if (!profile.email) {
      throw new Error('A conta Google nao retornou um e-mail.');
    }

    accessTokenRef.current = accessToken;
    setUser({
      email: profile.email,
      name: profile.name ?? profile.email,
      picture: profile.picture ?? null,
    });
  }, []);

  const logout = useCallback(() => {
    const token = accessTokenRef.current;

    if (token) {
      window.google?.accounts.oauth2.revoke(token);
      accessTokenRef.current = null;
    }

    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      login,
      loginWithGoogle,
      logout,
    }),
    [user, login, loginWithGoogle, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
