package com.systructure.controller;

import com.systructure.model.Node;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class NodeController {
    @QueryMapping
    public Node nodeById(@Argument Long id) {
        return Node.getById(id);
    }

    @QueryMapping
    public List<Node> allNodes() {
        return Node.nodes;
    }
}
