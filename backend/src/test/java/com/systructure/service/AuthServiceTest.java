package com.systructure.service;

import com.systructure.dto.auth.AuthResponse;
import com.systructure.dto.auth.LoginRequest;
import com.systructure.dto.auth.SignupRequest;
import com.systructure.exception.AuthException;
import com.systructure.model.RefreshToken;
import com.systructure.model.Role;
import com.systructure.model.User;
import com.systructure.repository.RefreshTokenRepository;
import com.systructure.repository.UserRepository;
import com.systructure.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private RefreshTokenRepository refreshTokenRepository;
    
    @Mock
    private PasswordEncoder passwordEncoder;
    
    @Mock
    private JwtService jwtService;
    
    @Mock
    private AuthenticationManager authenticationManager;
    
    @InjectMocks
    private AuthService authService;
    
    private User testUser;
    private RefreshToken testRefreshToken;
    
    @BeforeEach
    void setUp() {
        testUser = User.builder()
            .id(1L)
            .email("test@example.com")
            .password("encoded-password")
            .username("testuser")
            .role(Role.USER)
            .build();
        
        testRefreshToken = RefreshToken.builder()
            .id(1L)
            .token(UUID.randomUUID().toString())
            .user(testUser)
            .expiryDate(Instant.now().plusSeconds(604800))
            .build();
    }
    
    @Test
    @DisplayName("Should signup new user successfully")
    void shouldSignupNewUserSuccessfully() {
        SignupRequest request = new SignupRequest("new@example.com", "password123", "newuser");
        
        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(1L);
            return user;
        });
        when(jwtService.generateAccessToken(any(User.class))).thenReturn("access-token");
        when(jwtService.getAccessTokenExpirationMs()).thenReturn(900000L);
        when(jwtService.getRefreshTokenExpirationMs()).thenReturn(604800000L);
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenReturn(testRefreshToken);
        
        AuthResponse response = authService.signup(request);
        
        assertThat(response.accessToken()).isEqualTo("access-token");
        assertThat(response.refreshToken()).isEqualTo(testRefreshToken.getToken());
        assertThat(response.user().email()).isEqualTo("new@example.com");
        
        verify(userRepository).save(any(User.class));
        verify(refreshTokenRepository).save(any(RefreshToken.class));
    }
    
    @Test
    @DisplayName("Should throw exception when email already exists")
    void shouldThrowExceptionWhenEmailExists() {
        SignupRequest request = new SignupRequest("existing@example.com", "password123", null);
        
        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);
        
        assertThatThrownBy(() -> authService.signup(request))
            .isInstanceOf(AuthException.class)
            .hasMessageContaining("already registered");
        
        verify(userRepository, never()).save(any());
    }
    
    @Test
    @DisplayName("Should login user successfully")
    void shouldLoginUserSuccessfully() {
        LoginRequest request = new LoginRequest("test@example.com", "password123");
        
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
            .thenReturn(new UsernamePasswordAuthenticationToken(testUser, null));
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(jwtService.generateAccessToken(testUser)).thenReturn("access-token");
        when(jwtService.getAccessTokenExpirationMs()).thenReturn(900000L);
        when(jwtService.getRefreshTokenExpirationMs()).thenReturn(604800000L);
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenReturn(testRefreshToken);
        
        AuthResponse response = authService.login(request);
        
        assertThat(response.accessToken()).isEqualTo("access-token");
        assertThat(response.user().email()).isEqualTo("test@example.com");
        
        verify(refreshTokenRepository).deleteByUser(testUser);
    }
    
    @Test
    @DisplayName("Should throw exception for invalid credentials")
    void shouldThrowExceptionForInvalidCredentials() {
        LoginRequest request = new LoginRequest("test@example.com", "wrongpassword");
        
        when(authenticationManager.authenticate(any()))
            .thenThrow(new BadCredentialsException("Bad credentials"));
        
        assertThatThrownBy(() -> authService.login(request))
            .isInstanceOf(BadCredentialsException.class);
    }
    
    @Test
    @DisplayName("Should refresh token successfully")
    void shouldRefreshTokenSuccessfully() {
        when(refreshTokenRepository.findByToken(testRefreshToken.getToken()))
            .thenReturn(Optional.of(testRefreshToken));
        when(jwtService.generateAccessToken(testUser)).thenReturn("new-access-token");
        when(jwtService.getAccessTokenExpirationMs()).thenReturn(900000L);
        
        AuthResponse response = authService.refreshToken(testRefreshToken.getToken());
        
        assertThat(response.accessToken()).isEqualTo("new-access-token");
        assertThat(response.refreshToken()).isEqualTo(testRefreshToken.getToken());
    }
    
    @Test
    @DisplayName("Should throw exception for expired refresh token")
    void shouldThrowExceptionForExpiredRefreshToken() {
        RefreshToken expiredToken = RefreshToken.builder()
            .token("expired-token")
            .user(testUser)
            .expiryDate(Instant.now().minusSeconds(3600))
            .build();
        
        when(refreshTokenRepository.findByToken("expired-token"))
            .thenReturn(Optional.of(expiredToken));
        
        assertThatThrownBy(() -> authService.refreshToken("expired-token"))
            .isInstanceOf(AuthException.class)
            .hasMessageContaining("expired");
        
        verify(refreshTokenRepository).delete(expiredToken);
    }
    
    @Test
    @DisplayName("Should logout and delete refresh token")
    void shouldLogoutAndDeleteRefreshToken() {
        when(refreshTokenRepository.findByToken(testRefreshToken.getToken()))
            .thenReturn(Optional.of(testRefreshToken));
        
        authService.logout(testRefreshToken.getToken());
        
        verify(refreshTokenRepository).delete(testRefreshToken);
    }
}
