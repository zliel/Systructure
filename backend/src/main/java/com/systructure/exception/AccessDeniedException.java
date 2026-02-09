package com.systructure.exception;

public class AccessDeniedException extends RuntimeException {

    public AccessDeniedException(String message) {
        super(message);
    }

    public AccessDeniedException(String action, Long resourceId) {
        super(String.format("Access denied: cannot %s resource %d", action, resourceId));
    }
}

