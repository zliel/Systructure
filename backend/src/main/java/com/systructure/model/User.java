package com.systructure.model;

import java.util.List;

public record User(Long id, String username, String password, String email, Role role) {

    public static final List<User> users = List.of(
            new User(1L, "Alice", "password1", "test@test.com", Role.ADMIN),
            new User(2L, "Bob", "password2", "test2@test.com", Role.USER)
    );

    public static User getById(Long id) {
        return users.stream()
                .filter(user -> user.id().equals(id))
                .findFirst()
                .orElse(null);
    }
}
