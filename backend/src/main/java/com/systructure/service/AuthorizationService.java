package com.systructure.service;

import com.systructure.exception.AccessDeniedException;
import com.systructure.model.Project;
import com.systructure.model.ProjectRole;
import com.systructure.repository.ProjectMemberRepository;
import com.systructure.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthorizationService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;

    private static final Set<ProjectRole> VIEW_ROLES = Set.of(ProjectRole.OWNER, ProjectRole.EDITOR, ProjectRole.VIEWER);
    private static final Set<ProjectRole> EDIT_ROLES = Set.of(ProjectRole.OWNER, ProjectRole.EDITOR);
    private static final Set<ProjectRole> MANAGE_ROLES = Set.of(ProjectRole.OWNER);

    public Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return null;
        }

        if (auth.getPrincipal() instanceof com.systructure.model.User user) {
            return user.getId();
        }
        return null;
    }

    /**
     * Check if user can view the project.
     * Allowed: OWNER, EDITOR, VIEWER, or anyone if project is public.
     */
    public boolean canViewProject(Long userId, Long projectId) {
        Optional<Project> projectOpt = projectRepository.findById(projectId);
        if (projectOpt.isEmpty()) {
            return false;
        }

        Project project = projectOpt.get();

        if (project.getIsPublic()) {
            return true;
        }

        if (userId == null) {
            return false;
        }

        return getUserRole(userId, projectId)
                .map(VIEW_ROLES::contains)
                .orElse(false);
    }

    /**
     * Check if user can edit the project (create/modify/delete nodes and edges).
     * Allowed: OWNER, EDITOR only.
     */
    public boolean canEditProject(Long userId, Long projectId) {
        if (userId == null) {
            return false;
        }

        return getUserRole(userId, projectId)
                .map(EDIT_ROLES::contains)
                .orElse(false);
    }

    /**
     * Check if user can manage the project (update project settings, manage
     * members, delete project).
     * Allowed: OWNER only.
     */
    public boolean canManageProject(Long userId, Long projectId) {
        if (userId == null) {
            return false;
        }

        return getUserRole(userId, projectId)
                .map(MANAGE_ROLES::contains)
                .orElse(false);
    }

    /**
     * Get user's role in a project.
     */
    public Optional<ProjectRole> getUserRole(Long userId, Long projectId) {
        return projectMemberRepository.findRoleByProjectIdAndUserId(projectId, userId);
    }

    /**
     * Require view permission or throw AccessDeniedException.
     */
    public void requireViewPermission(Long projectId) {
        Long userId = getCurrentUserId();
        if (!canViewProject(userId, projectId)) {
            throw new AccessDeniedException("view", projectId);
        }
    }

    /**
     * Require edit permission or throw AccessDeniedException.
     */
    public void requireEditPermission(Long projectId) {
        Long userId = getCurrentUserId();
        if (!canEditProject(userId, projectId)) {
            throw new AccessDeniedException("edit", projectId);
        }
    }

    /**
     * Require manage permission or throw AccessDeniedException.
     */
    public void requireManagePermission(Long projectId) {
        Long userId = getCurrentUserId();
        if (!canManageProject(userId, projectId)) {
            throw new AccessDeniedException("manage", projectId);
        }
    }
}
