package com.systructure.controller;

import com.systructure.model.*;
import com.systructure.repository.EdgeRepository;
import com.systructure.repository.NodeRepository;
import com.systructure.repository.ProjectRepository;
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

    private final ProjectRepository projectRepository;
    private final NodeRepository nodeRepository;
    private final EdgeRepository edgeRepository;

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

    @SchemaMapping
    public User createdBy(Project project) {
        return project.getCreatedBy();
    }

    @SchemaMapping
    public List<ProjectMember> members(Project project) {
        return project.getProjectMembers();
    }

    @MutationMapping
    public Project updateProject(@Argument Long id, @Argument ProjectInput updatedProjectData) {
        Project project = projectRepository.findById(id).orElse(null);
        if (project == null) {
            return null;
        }

        updatedProjectData.name().ifPresent(project::setName);
        updatedProjectData.description().ifPresent(project::setDescription);
        updatedProjectData.isPublic().ifPresent(project::setIsPublic);

        updatedProjectData.nodeIds().ifPresent(ids ->
                project.setNodes(nodeRepository.findAllById(ids)));

        updatedProjectData.edgeIds().ifPresent(ids ->
                project.setEdges(edgeRepository.findAllById(ids)));

        return projectRepository.save(project);
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
