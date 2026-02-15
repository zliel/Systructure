package com.systructure.controller;

import com.systructure.model.Project;
import com.systructure.model.ProjectMember;
import com.systructure.model.ProjectRole;
import com.systructure.model.User;
import com.systructure.service.ProjectMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.Map;

@Controller
@RequiredArgsConstructor
public class ProjectMemberController {

    private final ProjectMemberService projectMemberService;

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

    @SchemaMapping
    public User user(ProjectMember projectMember) {
        return projectMember.getUser();
    }

    @SchemaMapping
    public Project project(ProjectMember projectMember) {
        return projectMember.getProject();
    }

    @SchemaMapping
    public ProjectRole projectRole(ProjectMember projectMember) {
        return projectMember.getProjectRole();
    }

    @MutationMapping
    public ProjectMember addProjectMember(@Argument Map<String, Object> input) {
        Long projectId = Long.valueOf(input.get("projectId").toString());
        String identifier = input.get("identifier").toString();
        ProjectRole role = ProjectRole.valueOf(input.get("role").toString());

        return projectMemberService.addMemberByIdentifier(projectId, identifier, role);
    }

    @MutationMapping
    public ProjectMember updateProjectMemberRole(@Argument Map<String, Object> input) {
        Long memberId = Long.valueOf(input.get("memberId").toString());
        ProjectRole role = ProjectRole.valueOf(input.get("role").toString());

        return projectMemberService.updateRole(memberId, role)
                .orElseThrow(() -> new IllegalArgumentException("Member not found: " + memberId));
    }

    @MutationMapping
    public ProjectMember removeProjectMember(@Argument Long memberId) {
        return projectMemberService.removeMember(memberId)
                .orElseThrow(() -> new IllegalArgumentException("Member not found: " + memberId));
    }
}

