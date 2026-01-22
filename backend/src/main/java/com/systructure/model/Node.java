package com.systructure.model;

import java.util.List;

public record Node(Long id, String name, NodeType type, float xPos, float yPos) {
    public static List<Node> nodes = List.of(
            new Node(1L, "Node.js API", NodeType.SERVICE, 100.0f, 150.0f),
            new Node(2L, "PostgreSQL", NodeType.DATABASE, 200.0f, 250.0f),
            new Node(3L, "Nginx", NodeType.GATEWAY, 300.0f, 350.0f)
    );

    public static Node getById(Long id) {
        return nodes.stream()
                .filter(node -> node.id().equals(id))
                .findFirst()
                .orElse(null);
    }
}
