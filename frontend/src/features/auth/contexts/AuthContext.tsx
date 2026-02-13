import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
    type ReactNode,
} from 'react';

import type { AuthUser } from '@/features/auth/types';
import {
    setTokens,
    getAccessToken,
    getRefreshToken,
    clearTokens,
    isTokenExpired,
} from '@/features/auth/api/auth';
import {
    loginApi,
    signupApi,
    refreshTokenApi,
    logoutApi,
    AuthApiError,
} from '@/features/auth/api/authApi';

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

    /**
     * Attempt to refresh the access token
     */
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
            // Refresh failed, clear everything
            clearTokens();
            setUser(null);
            return false;
        }
    }, []);

    /**
     * Login with email and password
     */
    const login = useCallback(async (email: string, password: string): Promise<void> => {
        const response = await loginApi({ email, password });
        setTokens(response.accessToken, response.refreshToken);
        setUser(response.user);
    }, []);

    /**
     * Sign up a new user
     */
    const signup = useCallback(
        async (email: string, password: string, username?: string): Promise<void> => {
            const response = await signupApi({ email, password, username });
            setTokens(response.accessToken, response.refreshToken);
            setUser(response.user);
        },
        []
    );

    /**
     * Logout the current user
     */
    const logout = useCallback(async (): Promise<void> => {
        const refreshToken = getRefreshToken();

        // Clear local state first
        clearTokens();
        setUser(null);

        // Try to invalidate server-side, but don't block on it
        if (refreshToken) {
            try {
                await logoutApi(refreshToken);
            } catch {
                // Ignore errors - token is already cleared locally
            }
        }
    }, []);

    /**
     * Initialize auth state on mount
     */
    useEffect(() => {
        async function initAuth() {
            const accessToken = getAccessToken();
            const refreshToken = getRefreshToken();

            if (!accessToken || !refreshToken) {
                setIsLoading(false);
                return;
            }

            // Check if access token is expired
            if (isTokenExpired(accessToken)) {
                // Try to refresh
                const success = await refreshAuth();
                if (!success) {
                    clearTokens();
                }
            } else {
                // Token is valid, try to refresh to get user data
                // (we don't store user in localStorage)
                const success = await refreshAuth();
                if (!success) {
                    // Refresh failed but access token was valid
                    // This shouldn't happen, but clear just in case
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

// Re-export the error class for use in components
export { AuthApiError };
