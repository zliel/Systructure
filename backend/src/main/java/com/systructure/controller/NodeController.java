package com.systructure.controller;

import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import com.systructure.model.Node;

@Controller
public class NodeController {
    @QueryMapping
    public Node nodeById(@Argument String id) {
        return Node.getById(id);
    }
}
