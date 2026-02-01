package com.systructure.controller;

import com.systructure.dto.auth.*;
import com.systructure.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    
    /**
     * Register a new user account
     * 
     * POST /api/auth/signup
     * Content-Type: application/json
     * 
     * Request Body:
     * {
     *   "email": "user@example.com",
     *   "password": "SecureP@ss123",
     *   "username": "johndoe"  (optional)
     * }
     * 
     * Response: 201 Created
     * {
     *   "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     *   "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
     *   "tokenType": "Bearer",
     *   "expiresIn": 900,
     *   "user": {
     *     "id": 1,
     *     "email": "user@example.com",
     *     "username": "johndoe",
     *     "role": "USER"
     *   }
     * }
     */
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        AuthResponse response = authService.signup(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * Authenticate with existing credentials
     * 
     * POST /api/auth/login
     * Content-Type: application/json
     * 
     * Request Body:
     * {
     *   "email": "user@example.com",
     *   "password": "SecureP@ss123"
     * }
     * 
     * Response: 200 OK
     * {
     *   "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     *   "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
     *   "tokenType": "Bearer",
     *   "expiresIn": 900,
     *   "user": { ... }
     * }
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Refresh access token using refresh token
     * 
     * POST /api/auth/refresh
     * Content-Type: application/json
     * 
     * Request Body:
     * {
     *   "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
     * }
     * 
     * Response: 200 OK
     * {
     *   "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     *   "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
     *   "tokenType": "Bearer",
     *   "expiresIn": 900,
     *   "user": { ... }
     * }
     */
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refreshToken(request.refreshToken());
        return ResponseEntity.ok(response);
    }
    
    /**
     * Logout and invalidate refresh token
     * 
     * POST /api/auth/logout
     * Content-Type: application/json
     * 
     * Request Body:
     * {
     *   "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
     * }
     * 
     * Response: 204 No Content
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody RefreshTokenRequest request) {
        authService.logout(request.refreshToken());
        return ResponseEntity.noContent().build();
    }
}
