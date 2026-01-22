package com.systructure.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "edges")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Edge {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_node_id", nullable = false)
    public Node sourceNode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_node_id", nullable = false)
    public Node targetNode;


    public static List<Edge> edges = List.of(
            new Edge(1L, Node.getById(1L), Node.getById(2L)),
            new Edge(2L, Node.getById(2L), Node.getById(3L)),
            new Edge(3L, Node.getById(3L), Node.getById(1L))
    );

    public static Edge getById(Long id) {
        return edges.stream()
                .filter(edge -> edge.getId().equals(id))
                .findFirst()
                .orElse(null);
    }
}
