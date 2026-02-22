package com.systructure.controller;

import com.systructure.exception.EntityNotFoundException;
import com.systructure.model.Project;
import com.systructure.model.ProjectMember;
import com.systructure.model.ProjectRole;
import com.systructure.model.User;
import com.systructure.repository.ProjectRepository;
import com.systructure.repository.UserRepository;
import com.systructure.service.ProjectMemberService;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.*;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
public class ProjectMemberController {

    private final ProjectMemberService projectMemberService;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;

    @QueryMapping
    public ProjectMember projectMemberById(@Argument Long id) {
        return projectMemberService.findById(id).orElse(null);
    }

    @QueryMapping
    public ProjectRole userRoleInProject(@Argument Long userId, @Argument Long projectId) {
        return projectMemberService.findUserRoleInProject(userId, projectId).orElse(null);
    }

    @QueryMapping
    public List<ProjectMember> projectMembershipsByUserId(@Argument Long userId) {
        return projectMemberService.findByUserId(userId);
    }

    @QueryMapping
    public List<ProjectMember> projectMembershipsByProjectId(@Argument Long projectId) {
        return projectMemberService.findByProjectId(projectId);
    }

    @BatchMapping
    public Map<ProjectMember, User> user(List<ProjectMember> members) {
        Set<Long> userIds = members.stream()
                .map(m -> m.getUser().getId())
                .collect(Collectors.toSet());
        Map<Long, User> userMap = userRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(User::getId, u -> u));
        return members.stream().collect(Collectors.toMap(
                m -> m,
                m -> userMap.get(m.getUser().getId())
        ));
    }

    @BatchMapping
    public Map<ProjectMember, Project> project(List<ProjectMember> members) {
        Set<Long> projectIds = members.stream()
                .map(m -> m.getProject().getId())
                .collect(Collectors.toSet());
        Map<Long, Project> projectMap = projectRepository.findAllById(projectIds).stream()
                .collect(Collectors.toMap(Project::getId, p -> p));
        return members.stream().collect(Collectors.toMap(
                m -> m,
                m -> projectMap.get(m.getProject().getId())
        ));
    }

    @SchemaMapping
    public ProjectRole projectRole(ProjectMember projectMember) {
        return projectMember.getProjectRole();
    }

    @MutationMapping
    public ProjectMember addProjectMember(@Argument AddMemberInput input) {
        return projectMemberService.addMemberByIdentifier(
                input.projectId(), input.identifier(), input.role());
    }

    @MutationMapping
    public ProjectMember updateProjectMemberRole(@Argument UpdateMemberRoleInput input) {
        return projectMemberService.updateRole(input.memberId(), input.role())
                .orElseThrow(() -> new EntityNotFoundException("ProjectMember", input.memberId()));
    }

    @MutationMapping
    public ProjectMember removeProjectMember(@Argument Long memberId) {
        return projectMemberService.removeMember(memberId)
                .orElseThrow(() -> new EntityNotFoundException("ProjectMember", memberId));
    }

    public record AddMemberInput(
            @NotNull Long projectId,
            @NotBlank String identifier,
            @NotNull ProjectRole role
    ) {
    }

    public record UpdateMemberRoleInput(
            @NotNull Long memberId,
            @NotNull ProjectRole role
    ) {
    }
}
