package com.systructure.controller;

import com.systructure.model.Edge;
import com.systructure.model.Node;
import com.systructure.model.Project;
import com.systructure.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectRepository projectRepository;

    @QueryMapping
    public Project projectById(@Argument Long id) {
        return projectRepository.findById(id).orElse(null);
    }

    @QueryMapping
    public List<Project> allProjects() {
        return projectRepository.findAll();
    }

    @SchemaMapping
    public List<Node> nodes(Project project) {
        return project.getNodes();
    }

    @SchemaMapping
    public List<Edge> edges(Project project) {
        return project.getEdges();
    }
}
