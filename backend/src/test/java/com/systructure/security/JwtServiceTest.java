package com.systructure.security;

import io.jsonwebtoken.ExpiredJwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JwtServiceTest {
    
    private JwtService jwtService;
    private UserDetails testUser;
    
    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        // Use reflection to set private fields since we're not using Spring context
        ReflectionTestUtils.setField(jwtService, "jwtSecret", 
            "test-secret-key-that-is-at-least-256-bits-long-for-hs256-algorithm");
        ReflectionTestUtils.setField(jwtService, "accessTokenExpirationMs", 900000L); // 15 min
        ReflectionTestUtils.setField(jwtService, "refreshTokenExpirationMs", 604800000L); // 7 days
        
        testUser = User.builder()
            .username("test@example.com")
            .password("password")
            .authorities(Collections.emptyList())
            .build();
    }
    
    @Test
    @DisplayName("Should generate valid access token")
    void shouldGenerateValidAccessToken() {
        String token = jwtService.generateAccessToken(testUser);
        
        assertThat(token).isNotBlank();
        assertThat(token.split("\\.")).hasSize(3); // JWT has 3 parts
    }
    
    @Test
    @DisplayName("Should extract username from token")
    void shouldExtractUsernameFromToken() {
        String token = jwtService.generateAccessToken(testUser);
        
        String extractedUsername = jwtService.extractUsername(token);
        
        assertThat(extractedUsername).isEqualTo("test@example.com");
    }
    
    @Test
    @DisplayName("Should validate token successfully")
    void shouldValidateTokenSuccessfully() {
        String token = jwtService.generateAccessToken(testUser);
        
        boolean isValid = jwtService.validateToken(token, testUser);
        
        assertThat(isValid).isTrue();
    }
    
    @Test
    @DisplayName("Should return false for mismatched user")
    void shouldReturnFalseForMismatchedUser() {
        String token = jwtService.generateAccessToken(testUser);
        
        UserDetails differentUser = User.builder()
            .username("different@example.com")
            .password("password")
            .authorities(Collections.emptyList())
            .build();
        
        boolean isValid = jwtService.validateToken(token, differentUser);
        
        assertThat(isValid).isFalse();
    }
    
    @Test
    @DisplayName("Should detect expired token")
    void shouldDetectExpiredToken() {
        // Set a very short expiration
        ReflectionTestUtils.setField(jwtService, "accessTokenExpirationMs", 1L); // 1ms
        
        String token = jwtService.generateAccessToken(testUser);
        
        // Wait for token to expire
        try {
            Thread.sleep(10);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        assertThatThrownBy(() -> jwtService.isTokenExpired(token))
            .isInstanceOf(ExpiredJwtException.class);
    }
    
    @Test
    @DisplayName("Should return false for invalid token signature")
    void shouldReturnFalseForInvalidSignature() {
        String token = jwtService.generateAccessToken(testUser);
        String tamperedToken = token.substring(0, token.lastIndexOf('.')) + ".invalid";
        
        boolean isValid = jwtService.validateToken(tamperedToken, testUser);
        
        assertThat(isValid).isFalse();
    }
    
    @Test
    @DisplayName("Should return expiration times correctly")
    void shouldReturnExpirationTimesCorrectly() {
        assertThat(jwtService.getAccessTokenExpirationMs()).isEqualTo(900000L);
        assertThat(jwtService.getRefreshTokenExpirationMs()).isEqualTo(604800000L);
    }
}
