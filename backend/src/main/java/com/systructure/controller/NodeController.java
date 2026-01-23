package com.systructure.controller;

import com.systructure.model.Node;
import com.systructure.repository.NodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class NodeController {

    private final NodeRepository nodeRepository;

    @QueryMapping
    public Node nodeById(@Argument Long id) {
        return nodeRepository.findById(id).orElse(null);
    }

    @QueryMapping
    public List<Node> allNodes() {
        return nodeRepository.findAll();
    }
}
