package com.systructure.model;

import java.util.List;
import java.util.Objects;

public record Project(Long id, String name, String description, List<Node> nodes, List<Edge> edges) {

    public static List<Project> projects = List.of(new Project(1L, "Project 1", "Project description", Node.nodes, Edge.edges));

    public static Project getById(Long id) {
        return projects.stream()
                .filter(project -> Objects.equals(project.id(), id))
                .findFirst()
                .orElse(null);
    }
}
