package com.systructure.service;

import com.systructure.exception.AccessDeniedException;
import com.systructure.model.Project;
import com.systructure.model.ProjectRole;
import com.systructure.model.Role;
import com.systructure.model.User;
import com.systructure.repository.ProjectMemberRepository;
import com.systructure.repository.ProjectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthorizationServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private ProjectMemberRepository projectMemberRepository;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private AuthorizationService authorizationService;

    private User testUser;
    private Project testProject;
    private Project publicProject;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .role(Role.USER)
                .build();

        testProject = new Project();
        testProject.setId(1L);
        testProject.setName("Private Project");
        testProject.setIsPublic(false);

        publicProject = new Project();
        publicProject.setId(2L);
        publicProject.setName("Public Project");
        publicProject.setIsPublic(true);
    }

    private void mockSecurityContext(User user) {
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(user);
    }

    @Nested
    @DisplayName("canViewProject")
    class CanViewProject {

        @Test
        @DisplayName("Should allow view for OWNER")
        void shouldAllowViewForOwner() {
            when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));
            when(projectMemberRepository.findRoleByProjectIdAndUserId(1L, 1L))
                    .thenReturn(Optional.of(ProjectRole.OWNER));

            assertThat(authorizationService.canViewProject(1L, 1L)).isTrue();
        }

        @Test
        @DisplayName("Should allow view for EDITOR")
        void shouldAllowViewForEditor() {
            when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));
            when(projectMemberRepository.findRoleByProjectIdAndUserId(1L, 1L))
                    .thenReturn(Optional.of(ProjectRole.EDITOR));

            assertThat(authorizationService.canViewProject(1L, 1L)).isTrue();
        }

        @Test
        @DisplayName("Should allow view for VIEWER")
        void shouldAllowViewForViewer() {
            when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));
            when(projectMemberRepository.findRoleByProjectIdAndUserId(1L, 1L))
                    .thenReturn(Optional.of(ProjectRole.VIEWER));

            assertThat(authorizationService.canViewProject(1L, 1L)).isTrue();
        }

        @Test
        @DisplayName("Should allow view for public projects without membership")
        void shouldAllowViewForPublicProjectWithoutMembership() {
            when(projectRepository.findById(2L)).thenReturn(Optional.of(publicProject));

            assertThat(authorizationService.canViewProject(null, 2L)).isTrue();
        }

        @Test
        @DisplayName("Should deny view for non-member on private project")
        void shouldDenyViewForNonMemberOnPrivateProject() {
            when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));
            when(projectMemberRepository.findRoleByProjectIdAndUserId(1L, 99L))
                    .thenReturn(Optional.empty());

            assertThat(authorizationService.canViewProject(99L, 1L)).isFalse();
        }

        @Test
        @DisplayName("Should deny view for null user on private project")
        void shouldDenyViewForNullUserOnPrivateProject() {
            when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));

            assertThat(authorizationService.canViewProject(null, 1L)).isFalse();
        }
    }

    @Nested
    @DisplayName("canEditProject")
    class CanEditProject {

        @Test
        @DisplayName("Should allow edit for OWNER")
        void shouldAllowEditForOwner() {
            when(projectMemberRepository.findRoleByProjectIdAndUserId(1L, 1L))
                    .thenReturn(Optional.of(ProjectRole.OWNER));

            assertThat(authorizationService.canEditProject(1L, 1L)).isTrue();
        }

        @Test
        @DisplayName("Should allow edit for EDITOR")
        void shouldAllowEditForEditor() {
            when(projectMemberRepository.findRoleByProjectIdAndUserId(1L, 1L))
                    .thenReturn(Optional.of(ProjectRole.EDITOR));

            assertThat(authorizationService.canEditProject(1L, 1L)).isTrue();
        }

        @Test
        @DisplayName("Should deny edit for VIEWER")
        void shouldDenyEditForViewer() {
            when(projectMemberRepository.findRoleByProjectIdAndUserId(1L, 1L))
                    .thenReturn(Optional.of(ProjectRole.VIEWER));

            assertThat(authorizationService.canEditProject(1L, 1L)).isFalse();
        }

        @Test
        @DisplayName("Should deny edit for non-member")
        void shouldDenyEditForNonMember() {
            when(projectMemberRepository.findRoleByProjectIdAndUserId(1L, 99L))
                    .thenReturn(Optional.empty());

            assertThat(authorizationService.canEditProject(99L, 1L)).isFalse();
        }

        @Test
        @DisplayName("Should deny edit for null user")
        void shouldDenyEditForNullUser() {
            assertThat(authorizationService.canEditProject(null, 1L)).isFalse();
        }
    }

    @Nested
    @DisplayName("canManageProject")
    class CanManageProject {

        @Test
        @DisplayName("Should allow manage for OWNER")
        void shouldAllowManageForOwner() {
            when(projectMemberRepository.findRoleByProjectIdAndUserId(1L, 1L))
                    .thenReturn(Optional.of(ProjectRole.OWNER));

            assertThat(authorizationService.canManageProject(1L, 1L)).isTrue();
        }

        @Test
        @DisplayName("Should deny manage for EDITOR")
        void shouldDenyManageForEditor() {
            when(projectMemberRepository.findRoleByProjectIdAndUserId(1L, 1L))
                    .thenReturn(Optional.of(ProjectRole.EDITOR));

            assertThat(authorizationService.canManageProject(1L, 1L)).isFalse();
        }

        @Test
        @DisplayName("Should deny manage for VIEWER")
        void shouldDenyManageForViewer() {
            when(projectMemberRepository.findRoleByProjectIdAndUserId(1L, 1L))
                    .thenReturn(Optional.of(ProjectRole.VIEWER));

            assertThat(authorizationService.canManageProject(1L, 1L)).isFalse();
        }
    }

    @Nested
    @DisplayName("requireEditPermission")
    class RequireEditPermission {

        @Test
        @DisplayName("Should not throw for EDITOR")
        void shouldNotThrowForEditor() {
            mockSecurityContext(testUser);
            when(projectMemberRepository.findRoleByProjectIdAndUserId(1L, 1L))
                    .thenReturn(Optional.of(ProjectRole.EDITOR));

            // Should not throw
            authorizationService.requireEditPermission(1L);
        }

        @Test
        @DisplayName("Should throw AccessDeniedException for VIEWER")
        void shouldThrowForViewer() {
            mockSecurityContext(testUser);
            when(projectMemberRepository.findRoleByProjectIdAndUserId(1L, 1L))
                    .thenReturn(Optional.of(ProjectRole.VIEWER));

            assertThatThrownBy(() -> authorizationService.requireEditPermission(1L))
                    .isInstanceOf(AccessDeniedException.class)
                    .hasMessageContaining("edit");
        }

        @Test
        @DisplayName("Should throw AccessDeniedException for non-member")
        void shouldThrowForNonMember() {
            mockSecurityContext(testUser);
            when(projectMemberRepository.findRoleByProjectIdAndUserId(1L, 1L))
                    .thenReturn(Optional.empty());

            assertThatThrownBy(() -> authorizationService.requireEditPermission(1L))
                    .isInstanceOf(AccessDeniedException.class);
        }
    }

    @Nested
    @DisplayName("requireManagePermission")
    class RequireManagePermission {

        @Test
        @DisplayName("Should not throw for OWNER")
        void shouldNotThrowForOwner() {
            mockSecurityContext(testUser);
            when(projectMemberRepository.findRoleByProjectIdAndUserId(1L, 1L))
                    .thenReturn(Optional.of(ProjectRole.OWNER));

            // Should not throw
            authorizationService.requireManagePermission(1L);
        }

        @Test
        @DisplayName("Should throw AccessDeniedException for EDITOR")
        void shouldThrowForEditor() {
            mockSecurityContext(testUser);
            when(projectMemberRepository.findRoleByProjectIdAndUserId(1L, 1L))
                    .thenReturn(Optional.of(ProjectRole.EDITOR));

            assertThatThrownBy(() -> authorizationService.requireManagePermission(1L))
                    .isInstanceOf(AccessDeniedException.class)
                    .hasMessageContaining("manage");
        }
    }
}
