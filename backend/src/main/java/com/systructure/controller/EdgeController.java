package com.systructure.controller;

import com.systructure.model.Edge;
import com.systructure.model.Node;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;

@Controller
public class EdgeController {
    @QueryMapping
    public Edge edgeById(@Argument String id) {
        return Edge.getById(id);
    }

    @SchemaMapping
    public Node sourceNode(Edge edge) {
        return Node.getById(edge.sourceNode().id());
    }

    @SchemaMapping
    public Node targetNode(Edge edge) {
        return Node.getById(edge.targetNode().id());
    }
}
