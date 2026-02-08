package com.systructure.service;

import com.systructure.model.*;
import com.systructure.repository.ProjectMemberRepository;
import com.systructure.repository.ProjectRepository;
import com.systructure.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectMemberServiceTest {

    @Mock
    private ProjectMemberRepository projectMemberRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private ProjectMemberService projectMemberService;

    private User testUser;
    private Project testProject;
    private ProjectMember testMember;

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

        testMember = new ProjectMember();
        testMember.setId(1L);
        testMember.setUser(testUser);
        testMember.setProject(testProject);
        testMember.setProjectRole(ProjectRole.EDITOR);
        testMember.setJoinedAt(LocalDateTime.now());
    }

    @Test
    @DisplayName("Should find member by ID")
    void shouldFindMemberById() {
        when(projectMemberRepository.findById(1L)).thenReturn(Optional.of(testMember));

        Optional<ProjectMember> result = projectMemberService.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getProjectRole()).isEqualTo(ProjectRole.EDITOR);
    }

    @Test
    @DisplayName("Should find members by user ID")
    void shouldFindMembersByUserId() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(projectMemberRepository.findByUser(testUser)).thenReturn(List.of(testMember));

        List<ProjectMember> result = projectMemberService.findByUserId(1L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getProject().getName()).isEqualTo("Test Project");
    }

    @Test
    @DisplayName("Should return empty list when user not found")
    void shouldReturnEmptyListWhenUserNotFound() {
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        List<ProjectMember> result = projectMemberService.findByUserId(999L);

        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("Should find members by project ID")
    void shouldFindMembersByProjectId() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));
        when(projectMemberRepository.findByProject(testProject)).thenReturn(List.of(testMember));

        List<ProjectMember> result = projectMemberService.findByProjectId(1L);

        assertThat(result).hasSize(1);
    }

    @Test
    @DisplayName("Should find user role in project")
    void shouldFindUserRoleInProject() {
        when(projectMemberRepository.findRoleByProjectIdAndUserId(1L, 1L))
                .thenReturn(Optional.of(ProjectRole.EDITOR));

        Optional<ProjectRole> result = projectMemberService.findUserRoleInProject(1L, 1L);

        assertThat(result).isPresent();
        assertThat(result.get()).isEqualTo(ProjectRole.EDITOR);
    }

    @Test
    @DisplayName("Should add member successfully")
    void shouldAddMemberSuccessfully() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(projectMemberRepository.findByUserAndProject(testUser, testProject)).thenReturn(Optional.empty());
        when(projectMemberRepository.save(any(ProjectMember.class))).thenAnswer(invocation -> {
            ProjectMember member = invocation.getArgument(0);
            member.setId(1L);
            return member;
        });

        ProjectMember result = projectMemberService.addMember(1L, 1L, ProjectRole.VIEWER);

        assertThat(result.getProjectRole()).isEqualTo(ProjectRole.VIEWER);
        assertThat(result.getUser()).isEqualTo(testUser);
        assertThat(result.getProject()).isEqualTo(testProject);
        verify(projectMemberRepository).save(any(ProjectMember.class));
    }

    @Test
    @DisplayName("Should throw exception when project not found during add")
    void shouldThrowExceptionWhenProjectNotFoundDuringAdd() {
        when(projectRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> projectMemberService.addMember(999L, 1L, ProjectRole.VIEWER))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Project not found");
    }

    @Test
    @DisplayName("Should throw exception when user not found during add")
    void shouldThrowExceptionWhenUserNotFoundDuringAdd() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> projectMemberService.addMember(1L, 999L, ProjectRole.VIEWER))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("User not found");
    }

    @Test
    @DisplayName("Should throw exception when user already a member")
    void shouldThrowExceptionWhenUserAlreadyMember() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(projectMemberRepository.findByUserAndProject(testUser, testProject)).thenReturn(Optional.of(testMember));

        assertThatThrownBy(() -> projectMemberService.addMember(1L, 1L, ProjectRole.VIEWER))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("already a member");
    }

    @Test
    @DisplayName("Should update member role successfully")
    void shouldUpdateMemberRoleSuccessfully() {
        when(projectMemberRepository.findById(1L)).thenReturn(Optional.of(testMember));
        when(projectMemberRepository.save(any(ProjectMember.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Optional<ProjectMember> result = projectMemberService.updateRole(1L, ProjectRole.OWNER);

        assertThat(result).isPresent();
        assertThat(result.get().getProjectRole()).isEqualTo(ProjectRole.OWNER);
    }

    @Test
    @DisplayName("Should return empty when updating nonexistent member")
    void shouldReturnEmptyWhenUpdatingNonexistentMember() {
        when(projectMemberRepository.findById(999L)).thenReturn(Optional.empty());

        Optional<ProjectMember> result = projectMemberService.updateRole(999L, ProjectRole.OWNER);

        assertThat(result).isEmpty();
        verify(projectMemberRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should remove member successfully")
    void shouldRemoveMemberSuccessfully() {
        when(projectMemberRepository.findById(1L)).thenReturn(Optional.of(testMember));

        Optional<ProjectMember> result = projectMemberService.removeMember(1L);

        assertThat(result).isPresent();
        verify(projectMemberRepository).delete(testMember);
    }

    @Test
    @DisplayName("Should return empty when removing nonexistent member")
    void shouldReturnEmptyWhenRemovingNonexistentMember() {
        when(projectMemberRepository.findById(999L)).thenReturn(Optional.empty());

        Optional<ProjectMember> result = projectMemberService.removeMember(999L);

        assertThat(result).isEmpty();
        verify(projectMemberRepository, never()).delete(any());
    }
}
