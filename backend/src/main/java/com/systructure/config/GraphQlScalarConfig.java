package com.systructure.config;

import graphql.GraphQLContext;
import graphql.execution.CoercedVariables;
import graphql.language.StringValue;
import graphql.language.Value;
import graphql.schema.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.graphql.execution.RuntimeWiringConfigurer;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Configuration
public class GraphQlScalarConfig {

    private static final GraphQLScalarType DATE_TIME = GraphQLScalarType.newScalar()
            .name("DateTime")
            .description("ISO-8601 date-time scalar that handles java.time.Instant")
            .coercing(new Coercing<Instant, String>() {

                @Override
                public String serialize(Object dataFetcherResult, GraphQLContext context, Locale locale)
                        throws CoercingSerializeException {
                    if (dataFetcherResult instanceof Instant instant) {
                        return DateTimeFormatter.ISO_INSTANT.format(instant);
                    }
                    if (dataFetcherResult instanceof OffsetDateTime odt) {
                        return DateTimeFormatter.ISO_INSTANT.format(odt.toInstant());
                    }
                    throw new CoercingSerializeException(
                            "Expected Instant or OffsetDateTime but got: " + dataFetcherResult.getClass().getName());
                }

                @Override
                public Instant parseValue(Object input, GraphQLContext context, Locale locale)
                        throws CoercingParseValueException {
                    if (input instanceof String s) {
                        try {
                            return Instant.parse(s);
                        } catch (Exception e) {
                            // Try OffsetDateTime parse as fallback
                            try {
                                return OffsetDateTime.parse(s).toInstant();
                            } catch (Exception e2) {
                                throw new CoercingParseValueException("Cannot parse DateTime from: " + s);
                            }
                        }
                    }
                    throw new CoercingParseValueException("Expected a String but got: " + input.getClass().getName());
                }

                @Override
                public Instant parseLiteral(Value<?> input, CoercedVariables variables,
                                            GraphQLContext context, Locale locale)
                        throws CoercingParseLiteralException {
                    if (input instanceof StringValue sv) {
                        try {
                            return Instant.parse(sv.getValue());
                        } catch (Exception e) {
                            try {
                                return OffsetDateTime.parse(sv.getValue()).toInstant();
                            } catch (Exception e2) {
                                throw new CoercingParseLiteralException("Cannot parse DateTime from: " + sv.getValue());
                            }
                        }
                    }
                    throw new CoercingParseLiteralException("Expected StringValue but got: " + input.getClass().getName());
                }
            })
            .build();

    @Bean
    public RuntimeWiringConfigurer runtimeWiringConfigurer() {
        return wiringBuilder -> wiringBuilder.scalar(DATE_TIME);
    }
}
