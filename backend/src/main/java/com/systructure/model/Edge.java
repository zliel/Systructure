package com.systructure.model;

import java.util.List;

public record Edge(Long id, Node sourceNode, Node targetNode) {
    public static List<Edge> edges = List.of(
            new Edge(1L, Node.getById(1L), Node.getById(2L)),
            new Edge(2L, Node.getById(2L), Node.getById(3L)),
            new Edge(3L, Node.getById(3L), Node.getById(1L))
    );

    public static Edge getById(Long id) {
        return edges.stream()
                .filter(edge -> edge.id().equals(id))
                .findFirst()
                .orElse(null);
    }
}
