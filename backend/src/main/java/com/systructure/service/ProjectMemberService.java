package com.systructure.service;

import com.systructure.model.Project;
import com.systructure.model.ProjectMember;
import com.systructure.model.ProjectRole;
import com.systructure.model.User;
import com.systructure.repository.ProjectMemberRepository;
import com.systructure.repository.ProjectRepository;
import com.systructure.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProjectMemberService {

    private final ProjectMemberRepository projectMemberRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;

    public Optional<ProjectMember> findById(Long id) {
        return projectMemberRepository.findById(id);
    }

    public List<ProjectMember> findByUserId(Long userId) {
        return userRepository.findById(userId)
                .map(projectMemberRepository::findByUser)
                .orElse(List.of());
    }

    public List<ProjectMember> findByProjectId(Long projectId) {
        return projectRepository.findById(projectId)
                .map(projectMemberRepository::findByProject)
                .orElse(List.of());
    }

    public Optional<ProjectRole> findUserRoleInProject(Long userId, Long projectId) {
        return projectMemberRepository.findRoleByProjectIdAndUserId(projectId, userId);
    }

    public List<ProjectMember> findByUserIdAndRole(Long userId, ProjectRole role) {
        return userRepository.findById(userId)
                .map(user -> projectMemberRepository.findByUserAndProjectRole(user, role))
                .orElse(List.of());
    }

    @Transactional
    public ProjectMember addMember(Long projectId, Long userId, ProjectRole role) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found: " + projectId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        // Check if already a member
        Optional<ProjectMember> existing = projectMemberRepository.findByUserAndProject(user, project);
        if (existing.isPresent()) {
            throw new IllegalStateException("User is already a member of this project");
        }

        ProjectMember member = new ProjectMember();
        member.setProject(project);
        member.setUser(user);
        member.setProjectRole(role);
        member.setJoinedAt(LocalDateTime.now());

        return projectMemberRepository.save(member);
    }

    @Transactional
    public Optional<ProjectMember> updateRole(Long memberId, ProjectRole newRole) {
        return projectMemberRepository.findById(memberId).map(member -> {
            member.setProjectRole(newRole);
            return projectMemberRepository.save(member);
        });
    }

    @Transactional
    public Optional<ProjectMember> removeMember(Long memberId) {
        return projectMemberRepository.findById(memberId).map(member -> {
            projectMemberRepository.delete(member);
            return member;
        });
    }
}
