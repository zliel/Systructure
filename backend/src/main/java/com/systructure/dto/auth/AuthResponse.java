package com.systructure.dto.auth;

public record AuthResponse(
    String accessToken,
    String refreshToken,
    String tokenType,
    Long expiresIn,
    UserDto user
) {
    public AuthResponse(String accessToken, String refreshToken, Long expiresIn, UserDto user) {
        this(accessToken, refreshToken, "Bearer", expiresIn, user);
    }
}
