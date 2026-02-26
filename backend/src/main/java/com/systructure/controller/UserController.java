package com.systructure.controller;

import com.systructure.model.ProjectMember;
import com.systructure.model.User;
import com.systructure.repository.ProjectMemberRepository;
import com.systructure.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.*;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final ProjectMemberRepository projectMemberRepository;

    @QueryMapping
    public User userById(@Argument Long id) {
        return userService.findById(id).orElse(null);
    }

    @MutationMapping
    public User updateProfile(@Argument UpdateProfileInput input) {
        return userService.updateProfile(
                input.username().orElse(null),
                input.currentPassword().orElse(null),
                input.newPassword().orElse(null)
        );
    }

    @MutationMapping
    public boolean deleteAccount(@Argument String password) {
        userService.deleteAccount(password);
        return true;
    }

    @BatchMapping
    public Map<User, List<ProjectMember>> projectMemberships(List<User> users) {
        List<ProjectMember> allMemberships = projectMemberRepository.findByUserIn(users);
        return users.stream().collect(Collectors.toMap(
                u -> u,
                u -> allMemberships.stream()
                        .filter(m -> m.getUser().getId().equals(u.getId()))
                        .toList()
        ));
    }

    /**
     * GraphQL resolver for User.username.
     * Without this, GraphQL calls getUsername() which returns email
     * (overridden for Spring Security's UserDetails).
     */
    @SchemaMapping
    public String username(User user) {
        return user.getDisplayName();
    }

    public record UpdateProfileInput(
            Optional<String> username,
            Optional<String> currentPassword,
            Optional<String> newPassword
    ) {
    }
}
