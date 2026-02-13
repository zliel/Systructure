import type { Role } from '@/types';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    email: string;
    password: string;
    username?: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    user: AuthUser;
}

export interface AuthUser {
    id: number;
    email: string;
    username: string;
    role: Role;
}
