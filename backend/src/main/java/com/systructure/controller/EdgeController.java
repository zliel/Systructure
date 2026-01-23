package com.systructure.controller;

import com.systructure.model.Edge;
import com.systructure.model.Node;
import com.systructure.repository.EdgeRepository;
import com.systructure.repository.NodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class EdgeController {
    private final NodeRepository nodeRepository;
    private final EdgeRepository edgeRepository;

    @QueryMapping
    public Edge edgeById(@Argument Long id) {
        return edgeRepository.findById(id).orElse(null);
    }

    @QueryMapping
    public List<Edge> allEdges() {
        return edgeRepository.findAll();
    }

    @SchemaMapping
    public Node sourceNode(Edge edge) {
        return nodeRepository.findById(edge.getSourceNode().getId()).orElse(null);
    }

    @SchemaMapping
    public Node targetNode(Edge edge) {
        return nodeRepository.findById(edge.getTargetNode().getId()).orElse(null);
    }
}
