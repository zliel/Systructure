package com.systructure.controller;

import com.systructure.model.ProjectMember;
import com.systructure.model.User;
import com.systructure.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class UserController {
    private final UserRepository userRepository;

    @QueryMapping
    public User userById(@Argument Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @QueryMapping
    public List<User> allUsers() {
        return userRepository.findAll();
    }

    @SchemaMapping
    public List<ProjectMember> projectMemberships(User user) {
        return user.getProjectMemberships();
    }
}
