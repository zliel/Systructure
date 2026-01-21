package com.systructure.model;

import java.util.Arrays;
import java.util.List;

public record Edge(String id, Node sourceNode, Node targetNode) {
    public static List<Edge> edges = Arrays.asList(
            new Edge("e1", Node.getById("1"), Node.getById("2")),
            new Edge("e2", Node.getById("2"), Node.getById("3")),
            new Edge("e3", Node.getById("3"), Node.getById("1"))
    );

    public static Edge getById(String id) {
        return edges.stream()
                .filter(edge -> edge.id().equals(id))
                .findFirst()
                .orElse(null);
    }
}
