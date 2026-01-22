package com.systructure.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "projects")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;
    private String description;
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Node> nodes;
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Edge> edges;

    public static List<Project> projects = List.of(new Project(1L, "Project 1", "Project description", Node.nodes, Edge.edges));

    public static Project getById(Long id) {
        return projects.stream()
                .filter(project -> project.getId().equals(id))
                .findFirst()
                .orElse(null);
    }
}
