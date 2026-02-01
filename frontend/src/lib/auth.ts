const ACCESS_TOKEN_KEY = 'systructure_access';
const REFRESH_TOKEN_KEY = 'systructure_refresh';

export function setTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

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

export function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return true;

  // exp is in seconds, Date.now() is in milliseconds
  const expirationMs = payload.exp * 1000;
  // Add a 30 second buffer to avoid edge cases
  return Date.now() >= expirationMs - 30000;
}

export function getTokenExpirationTime(token: string): number | null {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return null;
  return payload.exp * 1000;
}

