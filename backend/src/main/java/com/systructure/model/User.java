package com.systructure.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String username;
    private String password;
    private String email;
    @Enumerated(EnumType.STRING)
    private Role role;

    public static final List<User> users = List.of(
            new User(1L, "Alice", "password1", "test@test.com", Role.ADMIN),
            new User(2L, "Bob", "password2", "test2@test.com", Role.USER)
    );

    public static User getById(Long id) {
        return users.stream()
                .filter(user -> user.getId().equals(id))
                .findFirst()
                .orElse(null);
    }
}
