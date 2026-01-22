package com.systructure.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "nodes")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Node {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public Long id;

    public String name;
    @Enumerated(EnumType.STRING)
    public NodeType type;
    public Float xPos;
    public Float yPos;

    public static List<Node> nodes = List.of(
            new Node(1L, "Node.js API", NodeType.SERVICE, 100.0f, 150.0f),
            new Node(2L, "PostgreSQL", NodeType.DATABASE, 200.0f, 250.0f),
            new Node(3L, "Nginx", NodeType.GATEWAY, 300.0f, 350.0f)
    );

    public static Node getById(Long id) {
        return nodes.stream()
                .filter(node -> node.getId().equals(id))
                .findFirst()
                .orElse(null);
    }
}
