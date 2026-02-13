/**
 * REST API client for authentication endpoints
 */

import type { AuthResponse, LoginRequest, SignupRequest } from '@/features/auth/types';

const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/**
 * Custom error class for API errors
 */
export class AuthApiError extends Error {
    status: number;
    code: string | undefined;

    constructor(message: string, status: number, code?: string) {
        super(message);
        this.name = 'AuthApiError';
        this.status = status;
        this.code = code;
    }
}

/**
 * Make a request to the auth API
 */
async function authFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${AUTH_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        let errorMessage = 'An error occurred';
        let errorCode: string | undefined;

        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
            errorCode = errorData.code;
        } catch {
            // Response body is not JSON
            errorMessage = response.statusText || errorMessage;
        }

        throw new AuthApiError(errorMessage, response.status, errorCode);
    }

    // Handle 204 No Content
    if (response.status === 204) {
        return undefined as T;
    }

    return response.json();
}

/**
 * Login with email and password
 */
export async function loginApi(credentials: LoginRequest): Promise<AuthResponse> {
    return authFetch<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    });
}

/**
 * Sign up a new user
 */
export async function signupApi(data: SignupRequest): Promise<AuthResponse> {
    return authFetch<AuthResponse>('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

/**
 * Refresh the access token using a refresh token
 */
export async function refreshTokenApi(refreshToken: string): Promise<AuthResponse> {
    return authFetch<AuthResponse>('/api/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
    });
}

/**
 * Logout and invalidate the refresh token
 */
export async function logoutApi(refreshToken: string): Promise<void> {
    return authFetch<void>('/api/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
    });
}
