package com.systructure.controller;

import com.systructure.model.ProjectMember;
import com.systructure.model.User;
import com.systructure.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @QueryMapping
    public User userById(@Argument Long id) {
        return userService.findById(id).orElse(null);
    }

    @SchemaMapping
    public List<ProjectMember> projectMemberships(User user) {
        return user.getProjectMemberships();
    }
}

