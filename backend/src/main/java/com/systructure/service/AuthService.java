package com.systructure.service;

import com.systructure.dto.auth.*;
import com.systructure.exception.AuthException;
import com.systructure.model.RefreshToken;
import com.systructure.model.Role;
import com.systructure.model.User;
import com.systructure.repository.RefreshTokenRepository;
import com.systructure.repository.UserRepository;
import com.systructure.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    
    @Transactional
    public AuthResponse signup(SignupRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.email())) {
            throw AuthException.emailAlreadyExists();
        }
        
        // Create new user
        User user = User.builder()
            .email(request.email())
            .password(passwordEncoder.encode(request.password()))
            .username(request.username() != null ? request.username() : extractUsernameFromEmail(request.email()))
            .role(Role.USER)
            .build();
        
        user = userRepository.save(user);
        
        // Generate tokens
        String accessToken = jwtService.generateAccessToken(user);
        RefreshToken refreshToken = createRefreshToken(user);
        
        return new AuthResponse(
            accessToken,
            refreshToken.getToken(),
            jwtService.getAccessTokenExpirationMs() / 1000,
            UserDto.fromUser(user)
        );
    }
    
    @Transactional
    public AuthResponse login(LoginRequest request) {
        // Authenticate user
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );
        
        // Get user
        User user = userRepository.findByEmail(request.email())
            .orElseThrow(AuthException::invalidCredentials);
        
        // Revoke existing refresh tokens for this user (optional: keep if you want multi-device)
        refreshTokenRepository.deleteByUser(user);
        
        // Generate new tokens
        String accessToken = jwtService.generateAccessToken(user);
        RefreshToken refreshToken = createRefreshToken(user);
        
        return new AuthResponse(
            accessToken,
            refreshToken.getToken(),
            jwtService.getAccessTokenExpirationMs() / 1000,
            UserDto.fromUser(user)
        );
    }
    
    @Transactional
    public AuthResponse refreshToken(String refreshTokenValue) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(refreshTokenValue)
            .orElseThrow(AuthException::invalidRefreshToken);
        
        if (refreshToken.isExpired()) {
            refreshTokenRepository.delete(refreshToken);
            throw AuthException.invalidRefreshToken();
        }
        
        User user = refreshToken.getUser();
        
        // Generate new access token
        String accessToken = jwtService.generateAccessToken(user);
        
        return new AuthResponse(
            accessToken,
            refreshToken.getToken(), // Keep same refresh token
            jwtService.getAccessTokenExpirationMs() / 1000,
            UserDto.fromUser(user)
        );
    }
    
    @Transactional
    public void logout(String refreshTokenValue) {
        refreshTokenRepository.findByToken(refreshTokenValue)
            .ifPresent(refreshTokenRepository::delete);
    }
    
    private RefreshToken createRefreshToken(User user) {
        RefreshToken refreshToken = RefreshToken.builder()
            .token(UUID.randomUUID().toString())
            .user(user)
            .expiryDate(Instant.now().plusMillis(jwtService.getRefreshTokenExpirationMs()))
            .build();
        
        return refreshTokenRepository.save(refreshToken);
    }
    
    private String extractUsernameFromEmail(String email) {
        return email.substring(0, email.indexOf('@'));
    }
}
