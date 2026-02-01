package com.systructure.controller;

import com.systructure.model.*;
import com.systructure.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Controller
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectRepository projectRepository;
    private final NodeRepository nodeRepository;
    private final EdgeRepository edgeRepository;
    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;

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
    public Project createProject(@Argument CreateProjectInput newProjectData) {
        // Get current authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        assert auth != null;
        String email = auth.getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Create the project
        Project project = new Project();
        project.setName(newProjectData.name());
        project.setDescription(newProjectData.description().orElse(null));
        project.setIsPublic(newProjectData.isPublic().orElse(false));
        project.setCreatedBy(currentUser);
        project.setCreatedAt(LocalDateTime.now());
        project.setUpdatedAt(LocalDateTime.now());
        project.setNodes(new ArrayList<>());
        project.setEdges(new ArrayList<>());

        Project savedProject = projectRepository.save(project);

        // Add the creator as an OWNER member
        ProjectMember membership = new ProjectMember();
        membership.setUser(currentUser);
        membership.setProject(savedProject);
        membership.setProjectRole(ProjectRole.OWNER);
        membership.setJoinedAt(LocalDateTime.now());
        projectMemberRepository.save(membership);

        // Update project with the member
        savedProject.setProjectMembers(List.of(membership));

        return savedProject;
    }

    @MutationMapping
    public Project updateProject(@Argument Long id, @Argument UpdateProjectInput updatedProjectData) {
        Project project = projectRepository.findById(id).orElse(null);
        if (project == null) {
            return null;
        }

        updatedProjectData.name().ifPresent(project::setName);
        updatedProjectData.description().ifPresent(project::setDescription);
        updatedProjectData.isPublic().ifPresent(project::setIsPublic);
        updatedProjectData.nodeIds().ifPresent(ids -> project.setNodes(nodeRepository.findAllById(ids)));
        updatedProjectData.edgeIds().ifPresent(ids -> project.setEdges(edgeRepository.findAllById(ids)));

        return projectRepository.save(project);
    }

    public record CreateProjectInput(
            String name,
            Optional<String> description,
            Optional<Boolean> isPublic) {
    }

    public record UpdateProjectInput(
            Optional<String> name,
            Optional<String> description,
            Optional<Long> createdByUserId,
            Optional<Boolean> isPublic,
            Optional<List<Long>> memberIds,
            Optional<List<Long>> nodeIds,
            Optional<List<Long>> edgeIds) {
    }


}
