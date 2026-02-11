package com.systructure.service;

import com.systructure.model.*;
import com.systructure.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProjectMemberRepository projectMemberRepository;

    @Mock
    private NodeRepository nodeRepository;

    @Mock
    private EdgeRepository edgeRepository;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @Mock
    private AuthorizationService authorizationService;

    @InjectMocks
    private ProjectService projectService;

    private User testUser;
    private Project testProject;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .username("testuser")
                .role(Role.USER)
                .build();

        testProject = new Project();
        testProject.setId(1L);
        testProject.setName("Test Project");
        testProject.setDescription("A test project");
        testProject.setIsPublic(false);
        testProject.setCreatedBy(testUser);
        testProject.setCreatedAt(Instant.now());
        testProject.setUpdatedAt(Instant.now());
        testProject.setNodes(new ArrayList<>());
        testProject.setEdges(new ArrayList<>());
        testProject.setProjectMembers(new ArrayList<>());
    }

    private void mockSecurityContext() {
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("test@example.com");
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
    }

    @Test
    @DisplayName("Should find project by ID")
    void shouldFindProjectById() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));

        Optional<Project> result = projectService.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getName()).isEqualTo("Test Project");
        verify(projectRepository).findById(1L);
    }

    @Test
    @DisplayName("Should return empty when project not found")
    void shouldReturnEmptyWhenProjectNotFound() {
        when(projectRepository.findById(999L)).thenReturn(Optional.empty());

        Optional<Project> result = projectService.findById(999L);

        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("Should find all projects")
    void shouldFindAllProjects() {
        when(projectRepository.findAll()).thenReturn(List.of(testProject));

        List<Project> result = projectService.findAll();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("Test Project");
    }

    @Test
    @DisplayName("Should create project successfully")
    void shouldCreateProjectSuccessfully() {
        mockSecurityContext();

        when(projectRepository.save(any(Project.class))).thenAnswer(invocation -> {
            Project project = invocation.getArgument(0);
            project.setId(1L);
            return project;
        });
        when(projectMemberRepository.save(any(ProjectMember.class))).thenAnswer(invocation -> {
            ProjectMember member = invocation.getArgument(0);
            member.setId(1L);
            return member;
        });

        Project result = projectService.create("New Project", "Description", true);

        assertThat(result.getName()).isEqualTo("New Project");
        assertThat(result.getDescription()).isEqualTo("Description");
        assertThat(result.getIsPublic()).isTrue();
        assertThat(result.getCreatedBy()).isEqualTo(testUser);
        assertThat(result.getProjectMembers()).hasSize(1);
        assertThat(result.getProjectMembers().get(0).getProjectRole()).isEqualTo(ProjectRole.OWNER);

        verify(projectRepository).save(any(Project.class));
        verify(projectMemberRepository).save(any(ProjectMember.class));
    }

    @Test
    @DisplayName("Should create project with default values")
    void shouldCreateProjectWithDefaultValues() {
        mockSecurityContext();

        when(projectRepository.save(any(Project.class))).thenAnswer(invocation -> {
            Project project = invocation.getArgument(0);
            project.setId(1L);
            return project;
        });
        when(projectMemberRepository.save(any(ProjectMember.class))).thenAnswer(invocation -> {
            ProjectMember member = invocation.getArgument(0);
            member.setId(1L);
            return member;
        });

        Project result = projectService.create("Minimal Project", null, null);

        assertThat(result.getName()).isEqualTo("Minimal Project");
        assertThat(result.getDescription()).isNull();
        assertThat(result.getIsPublic()).isFalse();
    }

    @Test
    @DisplayName("Should throw exception when user not found during creation")
    void shouldThrowExceptionWhenUserNotFoundDuringCreation() {
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("unknown@example.com");
        when(userRepository.findByEmail("unknown@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> projectService.create("Project", null, null))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("User not found");
    }

    @Test
    @DisplayName("Should update project successfully")
    void shouldUpdateProjectSuccessfully() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));
        when(projectRepository.save(any(Project.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Optional<Project> result = projectService.update(1L, "Updated Name", "Updated Description", true, null, null);

        assertThat(result).isPresent();
        assertThat(result.get().getName()).isEqualTo("Updated Name");
        assertThat(result.get().getDescription()).isEqualTo("Updated Description");
        assertThat(result.get().getIsPublic()).isTrue();
    }

    @Test
    @DisplayName("Should update project nodes and edges")
    void shouldUpdateProjectNodesAndEdges() {
        Node node1 = new Node();
        node1.setId(1L);
        Edge edge1 = new Edge();
        edge1.setId(1L);

        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));
        when(nodeRepository.findAllById(List.of(1L))).thenReturn(List.of(node1));
        when(edgeRepository.findAllById(List.of(1L))).thenReturn(List.of(edge1));
        when(projectRepository.save(any(Project.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Optional<Project> result = projectService.update(1L, null, null, null, List.of(1L), List.of(1L));

        assertThat(result).isPresent();
        assertThat(result.get().getNodes()).hasSize(1);
        assertThat(result.get().getEdges()).hasSize(1);
    }

    @Test
    @DisplayName("Should return empty when updating nonexistent project")
    void shouldReturnEmptyWhenUpdatingNonexistentProject() {
        when(projectRepository.findById(999L)).thenReturn(Optional.empty());

        Optional<Project> result = projectService.update(999L, "Name", null, null, null, null);

        assertThat(result).isEmpty();
        verify(projectRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should delete project successfully")
    void shouldDeleteProjectSuccessfully() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));

        Optional<Project> result = projectService.delete(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getId()).isEqualTo(1L);
        verify(projectRepository).delete(testProject);
    }

    @Test
    @DisplayName("Should return empty when deleting nonexistent project")
    void shouldReturnEmptyWhenDeletingNonexistentProject() {
        when(projectRepository.findById(999L)).thenReturn(Optional.empty());

        Optional<Project> result = projectService.delete(999L);

        assertThat(result).isEmpty();
        verify(projectRepository, never()).delete(any());
    }
}
