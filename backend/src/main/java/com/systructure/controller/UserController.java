package com.systructure.controller;

import com.systructure.model.User;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class UserController {
    @QueryMapping
    public User userById(@Argument Long id) {
        return User.getById(id);
    }

    @QueryMapping
    public List<User> allUsers() {
        return User.users;
    }
}
