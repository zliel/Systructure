package com.systructure.exception;

/**
 * Thrown when a requested entity is not found in the database.
 */
public class EntityNotFoundException extends RuntimeException {

    public EntityNotFoundException(String entityType, Long id) {
        super(String.format("%s not found: %d", entityType, id));
    }

    public EntityNotFoundException(String message) {
        super(message);
    }
}
