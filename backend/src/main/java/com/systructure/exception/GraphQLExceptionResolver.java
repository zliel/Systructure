package com.systructure.exception;

import graphql.ErrorClassification;
import graphql.GraphQLError;
import graphql.schema.DataFetchingEnvironment;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.graphql.execution.DataFetcherExceptionResolverAdapter;
import org.springframework.stereotype.Component;

/**
 * Maps known exceptions to typed GraphQL errors with meaningful classifications.
 * This replaces the default INTERNAL_ERROR for all GraphQL data fetcher exceptions.
 */
@Component
public class GraphQLExceptionResolver extends DataFetcherExceptionResolverAdapter {

    private static final Logger log = LoggerFactory.getLogger(GraphQLExceptionResolver.class);

    /**
     * Custom error classifications for GraphQL responses.
     * These appear in the "extensions.classification" field.
     */
    public enum ErrorType implements ErrorClassification {
        VALIDATION_ERROR,
        BAD_REQUEST,
        NOT_FOUND,
        FORBIDDEN,
        UNAUTHORIZED,
        INTERNAL_ERROR
    }

    @Override
    protected GraphQLError resolveToSingleError(Throwable ex, DataFetchingEnvironment env) {
        ErrorType errorType;
        String message;

        switch (ex) {
            case ConstraintViolationException cve -> {
                errorType = ErrorType.VALIDATION_ERROR;
                message = cve.getConstraintViolations().stream()
                        .map(v -> v.getPropertyPath() + ": " + v.getMessage())
                        .reduce((a, b) -> a + "; " + b)
                        .orElse("Validation failed");
            }
            case EntityNotFoundException entityNotFoundException -> {
                errorType = ErrorType.NOT_FOUND;
                message = ex.getMessage();
            }
            case AccessDeniedException accessDeniedException -> {
                errorType = ErrorType.FORBIDDEN;
                message = ex.getMessage();
            }
            case AuthException authException -> {
                errorType = ErrorType.UNAUTHORIZED;
                message = ex.getMessage();
            }
            case IllegalArgumentException illegalArgumentException -> {
                errorType = ErrorType.BAD_REQUEST;
                message = ex.getMessage();
            }
            default -> {
                log.error("Unhandled exception in GraphQL resolver", ex);
                errorType = ErrorType.INTERNAL_ERROR;
                message = "An unexpected error occurred";
            }
        }

        return GraphQLError.newError()
                .errorType(errorType)
                .message(message)
                .path(env.getExecutionStepInfo().getPath())
                .location(env.getField().getSourceLocation())
                .build();
    }
}
