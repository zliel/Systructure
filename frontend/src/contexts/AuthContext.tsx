import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';

import type { AuthUser } from '@/types';
import {
  setTokens,
  getAccessToken,
  getRefreshToken,
  clearTokens,
  isTokenExpired,
} from '@/lib/auth';
import {
  loginApi,
  signupApi,
  refreshTokenApi,
  logoutApi,
  AuthApiError,
} from '@/lib/authApi';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = user !== null;

  const refreshAuth = useCallback(async (): Promise<boolean> => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      return false;
    }

    try {
      const response = await refreshTokenApi(refreshToken);
      setTokens(response.accessToken, response.refreshToken);
      setUser(response.user);
      return true;
    } catch (error) {
      clearTokens();
      setUser(null);
      return false;
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    const response = await loginApi({ email, password });
    setTokens(response.accessToken, response.refreshToken);
    setUser(response.user);
  }, []);

  const signup = useCallback(
    async (email: string, password: string, username?: string): Promise<void> => {
      const response = await signupApi({ email, password, username });
      setTokens(response.accessToken, response.refreshToken);
      setUser(response.user);
    },
    []
  );

  const logout = useCallback(async (): Promise<void> => {
    const refreshToken = getRefreshToken();

    clearTokens();
    setUser(null);

    if (refreshToken) {
      try {
        await logoutApi(refreshToken);
      } catch {
        // Ignore errors - token is already cleared locally
      }
    }
  }, []);

  useEffect(() => {
    async function initAuth() {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      if (!accessToken || !refreshToken) {
        setIsLoading(false);
        return;
      }

      if (isTokenExpired(accessToken)) {
        const successfullyRefreshed = await refreshAuth();
        if (!successfullyRefreshed) {
          clearTokens();
        }
      } else {
        // Token is valid, try to refresh to get user data
        const successfullyRefreshed = await refreshAuth();
        if (!successfullyRefreshed) {
          clearTokens();
        }
      }

      setIsLoading(false);
    }

    initAuth();
  }, [refreshAuth]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      login,
      signup,
      logout,
      refreshAuth,
    }),
    [user, isAuthenticated, isLoading, login, signup, logout, refreshAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthApiError };
