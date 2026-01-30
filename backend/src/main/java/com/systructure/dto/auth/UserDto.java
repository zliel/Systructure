package com.systructure.dto.auth;

import com.systructure.model.Role;
import com.systructure.model.User;

public record UserDto(
    Long id,
    String email,
    String username,
    Role role
) {
    public static UserDto fromUser(User user) {
        return new UserDto(
            user.getId(),
            user.getEmail(),
            user.getDisplayName(),
            user.getRole()
        );
    }
}
