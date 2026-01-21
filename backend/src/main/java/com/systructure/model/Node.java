package com.systructure.model;

import java.util.Arrays;
import java.util.List;

public record Node(String id, String name, NodeType type, float xPos, float yPos) {
    public static List<Node> nodes = Arrays.asList(
            new Node("1", "Node.js API", NodeType.SERVICE, 100.0f, 150.0f),
            new Node("2", "PostgreSQL", NodeType.DATABASE, 200.0f, 250.0f),
            new Node("3", "Nginx", NodeType.GATEWAY, 300.0f, 350.0f)
    );

    public static Node getById(String id) {
        return nodes.stream()
                .filter(node -> node.id().equals(id))
                .findFirst()
                .orElse(null);
    }
}
