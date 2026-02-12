package com.systructure.service;

import com.systructure.model.ProjectMember;
import com.systructure.model.ProjectRole;
import com.systructure.model.User;
import com.systructure.repository.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import com.systructure.model.ProjectMember;


@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final NodeRepository nodeRepository;
    private final EdgeRepository edgeRepository;
    private final AuthorizationService authorizationService;

    public Optional<Project> findById(Long id) {
        authorizationService.requireViewPermission(id);
        return projectRepository.findById(id);
    }

    public List<Project> findAccessibleByUser() {
        Long userId = authorizationService.getCurrentUserId();

        List<Project> memberProjects = projectMemberRepository
                .findByUser(userRepository.findById(userId)
                        .orElseThrow(() -> new RuntimeException("User not found")))
                .stream()
                .map(ProjectMember::getProject)
                .toList();

        List<Long> memberProjectIds = memberProjects.stream()
                .map(Project::getId)
                .toList();

        List<Project> publicProjects = projectRepository.findByIsPublicTrue()
                .stream()
                .filter(p -> !memberProjectIds.contains(p.getId()))
                .toList();

        List<Project> result = new ArrayList<>(memberProjects);
        result.addAll(publicProjects);
        return result;
    }

    @Transactional
    public Project create(String name, String description, Boolean isPublic) {
        User currentUser = getCurrentUser();

        Project project = new Project();
        project.setName(name);
        project.setDescription(description);
        project.setIsPublic(isPublic != null ? isPublic : false);
        project.setCreatedBy(currentUser);
        project.setCreatedAt(Instant.now());
        project.setUpdatedAt(Instant.now());
        project.setNodes(new ArrayList<>());
        project.setEdges(new ArrayList<>());

        Project savedProject = projectRepository.save(project);

        ProjectMember membership = new ProjectMember();
        membership.setUser(currentUser);
        membership.setProject(savedProject);
        membership.setProjectRole(ProjectRole.OWNER);
        membership.setJoinedAt(Instant.now());
        projectMemberRepository.save(membership);

        savedProject.setProjectMembers(List.of(membership));

        return savedProject;
    }

    @Transactional
    public Optional<Project> update(Long id, String name, String description, Boolean isPublic,
                                    List<Long> nodeIds, List<Long> edgeIds) {
        authorizationService.requireManagePermission(id);

        return projectRepository.findById(id).map(project -> {
            if (name != null) {
                project.setName(name);
            }
            if (description != null) {
                project.setDescription(description);
            }
            if (isPublic != null) {
                project.setIsPublic(isPublic);
            }
            if (nodeIds != null) {
                project.setNodes(nodeRepository.findAllById(nodeIds));
            }
            if (edgeIds != null) {
                project.setEdges(edgeRepository.findAllById(edgeIds));
            }
            project.setUpdatedAt(Instant.now());
            return projectRepository.save(project);
        });
    }

    @Transactional
    public Optional<Project> delete(Long id) {
        authorizationService.requireManagePermission(id);

        return projectRepository.findById(id).map(project -> {
            projectRepository.delete(project);
            return project;
        });
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}

