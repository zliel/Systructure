package com.systructure.controller;

import com.systructure.dto.auth.*;
import com.systructure.model.Role;
import com.systructure.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {
    
    @Mock
    private AuthService authService;
    
    @InjectMocks
    private AuthController authController;
    
    @Test
    @DisplayName("Should signup successfully with valid request")
    void shouldSignupSuccessfully() {
        SignupRequest request = new SignupRequest("test@example.com", "password123", "testuser");
        AuthResponse expectedResponse = new AuthResponse(
            "access-token",
            "refresh-token",
            "Bearer",
            900L,
            new UserDto(1L, "test@example.com", "testuser", Role.USER)
        );
        
        when(authService.signup(any(SignupRequest.class))).thenReturn(expectedResponse);
        
        ResponseEntity<AuthResponse> response = authController.signup(request);
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().accessToken()).isEqualTo("access-token");
        assertThat(response.getBody().refreshToken()).isEqualTo("refresh-token");
        assertThat(response.getBody().user().email()).isEqualTo("test@example.com");
    }
    
    @Test
    @DisplayName("Should login successfully with valid credentials")
    void shouldLoginSuccessfully() {
        LoginRequest request = new LoginRequest("test@example.com", "password123");
        AuthResponse expectedResponse = new AuthResponse(
            "access-token",
            "refresh-token",
            "Bearer",
            900L,
            new UserDto(1L, "test@example.com", "testuser", Role.USER)
        );
        
        when(authService.login(any(LoginRequest.class))).thenReturn(expectedResponse);
        
        ResponseEntity<AuthResponse> response = authController.login(request);
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().accessToken()).isEqualTo("access-token");
        assertThat(response.getBody().user().email()).isEqualTo("test@example.com");
    }
    
    @Test
    @DisplayName("Should refresh token successfully")
    void shouldRefreshTokenSuccessfully() {
        RefreshTokenRequest request = new RefreshTokenRequest("valid-refresh-token");
        AuthResponse expectedResponse = new AuthResponse(
            "new-access-token",
            "valid-refresh-token",
            "Bearer",
            900L,
            new UserDto(1L, "test@example.com", "testuser", Role.USER)
        );
        
        when(authService.refreshToken("valid-refresh-token")).thenReturn(expectedResponse);
        
        ResponseEntity<AuthResponse> response = authController.refresh(request);
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().accessToken()).isEqualTo("new-access-token");
    }
    
    @Test
    @DisplayName("Should logout successfully")
    void shouldLogoutSuccessfully() {
        RefreshTokenRequest request = new RefreshTokenRequest("refresh-token");
        
        ResponseEntity<Void> response = authController.logout(request);
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(authService).logout("refresh-token");
    }
}
