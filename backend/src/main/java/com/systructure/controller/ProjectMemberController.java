package com.systructure.controller;

import com.systructure.model.Project;
import com.systructure.model.ProjectMember;
import com.systructure.model.ProjectRole;
import com.systructure.model.User;
import com.systructure.repository.ProjectMemberRepository;
import com.systructure.repository.ProjectRepository;
import com.systructure.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ProjectMemberController {
    private final ProjectMemberRepository projectMemberRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;

    @QueryMapping
    public ProjectMember projectMemberById(@Argument Long id) {
        return projectMemberRepository.findById(id).orElse(null);
    }

    @QueryMapping
    public ProjectRole userRoleInProject(@Argument Long userId, @Argument Long projectId) {
        return projectMemberRepository.findRoleByProjectIdAndUserId(projectId, userId).orElse(null);
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
}
