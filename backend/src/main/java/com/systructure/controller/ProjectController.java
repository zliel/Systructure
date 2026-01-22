package com.systructure.controller;

import com.systructure.model.Edge;
import com.systructure.model.Node;
import com.systructure.model.Project;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class ProjectController {
    @QueryMapping
    public Project projectById(@Argument Long id) {
        return Project.getById(id);
    }

    @QueryMapping
    public List<Project> allProjects() {
        return Project.projects;
    }

    @SchemaMapping
    public List<Node> nodes(Project project) {
        return project.nodes();
    }

    @SchemaMapping
    public List<Edge> edges(Project project) {
        return project.edges();
    }
}
