package com.systructure.controller;

import com.systructure.model.*;
import com.systructure.repository.EdgeRepository;
import com.systructure.repository.NodeRepository;
import com.systructure.repository.ProjectMemberRepository;
import com.systructure.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.BatchMapping;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final NodeRepository nodeRepository;
    private final EdgeRepository edgeRepository;
    private final ProjectMemberRepository projectMemberRepository;

    @QueryMapping
    public Project projectById(@Argument Long id) {
        return projectService.findById(id).orElse(null);
    }

    @QueryMapping
    public List<Project> myProjects() {
        return projectService.findAccessibleByUser();
    }

    @BatchMapping
    public Map<Project, List<Node>> nodes(List<Project> projects) {
        List<Node> allNodes = nodeRepository.findByProjectIn(projects);
        return projects.stream().collect(Collectors.toMap(
                p -> p,
                p -> allNodes.stream()
                        .filter(n -> n.getProject().getId().equals(p.getId()))
                        .toList()
        ));
    }

    @BatchMapping
    public Map<Project, List<Edge>> edges(List<Project> projects) {
        List<Edge> allEdges = edgeRepository.findByProjectIn(projects);
        return projects.stream().collect(Collectors.toMap(
                p -> p,
                p -> allEdges.stream()
                        .filter(e -> e.getProject().getId().equals(p.getId()))
                        .toList()
        ));
    }

    @BatchMapping
    public Map<Project, User> createdBy(List<Project> projects) {
        return projects.stream().collect(Collectors.toMap(p -> p, Project::getCreatedBy));
    }

    @BatchMapping
    public Map<Project, List<ProjectMember>> members(List<Project> projects) {
        List<ProjectMember> allMembers = projectMemberRepository.findByProjectIn(projects);
        return projects.stream().collect(Collectors.toMap(
                p -> p,
                p -> allMembers.stream()
                        .filter(m -> m.getProject().getId().equals(p.getId()))
                        .toList()
        ));
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

    @MutationMapping
    public boolean deleteProject(@Argument Long id) {
        return projectService.delete(id).isPresent();
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

