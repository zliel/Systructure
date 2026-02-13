/**
 * Token storage and JWT utilities
 */

const ACCESS_TOKEN_KEY = 'systructure_access_token';
const REFRESH_TOKEN_KEY = 'systructure_refresh_token';

/**
 * Store access and refresh tokens in localStorage
 */
export function setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

/**
 * Get access token from localStorage
 */
export function getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
}

/**
 * Get refresh token from localStorage
 */
export function getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Clear all auth tokens from localStorage
 */
export function clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
}

/**
 * Decode a JWT token's payload (base64url encoded)
 */
function decodeJwtPayload(token: string): { exp?: number;[key: string]: unknown } | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        // Base64url decode the payload
        const payload = parts[1]
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const decoded = atob(payload);
        return JSON.parse(decoded);
    } catch {
        return null;
    }
}

/**
 * Check if a JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
    const payload = decodeJwtPayload(token);
    if (!payload?.exp) return true;

    // exp is in seconds, Date.now() is in milliseconds
    const expirationMs = payload.exp * 1000;
    // Add a 30 second buffer to avoid edge cases
    return Date.now() >= expirationMs - 30000;
}

/**
 * Get token expiration time in milliseconds
 */
export function getTokenExpirationTime(token: string): number | null {
    const payload = decodeJwtPayload(token);
    if (!payload?.exp) return null;
    return payload.exp * 1000;
}
