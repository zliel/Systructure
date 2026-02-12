package com.systructure.controller;

import com.systructure.model.*;
import com.systructure.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.Optional;

@Controller
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @QueryMapping
    public Project projectById(@Argument Long id) {
        return projectService.findById(id).orElse(null);
    }

    @QueryMapping
    public List<Project> myProjects() {
        return projectService.findAccessibleByUser();
    }

    @SchemaMapping
    public List<Node> nodes(Project project) {
        return project.getNodes();
    }

    @SchemaMapping
    public List<Edge> edges(Project project) {
        return project.getEdges();
    }

    @SchemaMapping
    public User createdBy(Project project) {
        return project.getCreatedBy();
    }

    @SchemaMapping
    public List<ProjectMember> members(Project project) {
        return project.getProjectMembers();
    }

    @MutationMapping
    public Project createProject(@Argument CreateProjectInput newProjectData) {
        return projectService.create(
                newProjectData.name(),
                newProjectData.description().orElse(null),
                newProjectData.isPublic().orElse(false)
        );
    }

    @MutationMapping
    public Project updateProject(@Argument Long id, @Argument ProjectInput updatedProjectData) {
        return projectService.update(
                id,
                updatedProjectData.name().orElse(null),
                updatedProjectData.description().orElse(null),
                updatedProjectData.isPublic().orElse(null),
                updatedProjectData.nodeIds().orElse(null),
                updatedProjectData.edgeIds().orElse(null)
        ).orElse(null);
    }

    public record CreateProjectInput(
            String name,
            Optional<String> description,
            Optional<Boolean> isPublic
    ) {
    }

    public record ProjectInput(
            Optional<String> name,
            Optional<String> description,
            Optional<Long> createdByUserId,
            Optional<Boolean> isPublic,
            Optional<List<Long>> memberIds,
            Optional<List<Long>> nodeIds,
            Optional<List<Long>> edgeIds
    ) {
    }
}
