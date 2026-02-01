package com.systructure.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class AuthException extends RuntimeException {
    
    public AuthException(String message) {
        super(message);
    }
    
    public AuthException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public static AuthException invalidCredentials() {
        return new AuthException("Invalid email or password");
    }
    
    public static AuthException emailAlreadyExists() {
        return new AuthException("Email is already registered");
    }
    
    public static AuthException invalidRefreshToken() {
        return new AuthException("Invalid or expired refresh token");
    }
    
    public static AuthException userNotFound() {
        return new AuthException("User not found");
    }
}
