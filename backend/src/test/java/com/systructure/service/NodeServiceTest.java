package com.systructure.service;

import com.systructure.model.Node;
import com.systructure.model.NodeType;
import com.systructure.model.Project;
import com.systructure.repository.NodeRepository;
import com.systructure.repository.ProjectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NodeServiceTest {

    @Mock
    private NodeRepository nodeRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private AuthorizationService authorizationService;

    @InjectMocks
    private NodeService nodeService;

    private Project testProject;
    private Node testNode;

    @BeforeEach
    void setUp() {
        testProject = new Project();
        testProject.setId(1L);
        testProject.setName("Test Project");

        testNode = new Node();
        testNode.setId(1L);
        testNode.setName("Test Node");
        testNode.setType(NodeType.SERVICE);
        testNode.setXPos(100.0f);
        testNode.setYPos(200.0f);
        testNode.setProject(testProject);
    }

    @Test
    @DisplayName("Should find node by ID")
    void shouldFindNodeById() {
        when(nodeRepository.findById(1L)).thenReturn(Optional.of(testNode));

        Optional<Node> result = nodeService.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getName()).isEqualTo("Test Node");
        verify(nodeRepository).findById(1L);
    }

    @Test
    @DisplayName("Should return empty when node not found")
    void shouldReturnEmptyWhenNodeNotFound() {
        when(nodeRepository.findById(999L)).thenReturn(Optional.empty());

        Optional<Node> result = nodeService.findById(999L);

        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("Should find all nodes")
    void shouldFindAllNodes() {
        when(nodeRepository.findAll()).thenReturn(List.of(testNode));

        List<Node> result = nodeService.findAll();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("Test Node");
    }

    @Test
    @DisplayName("Should create node successfully")
    void shouldCreateNodeSuccessfully() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));
        when(nodeRepository.save(any(Node.class))).thenAnswer(invocation -> {
            Node node = invocation.getArgument(0);
            node.setId(1L);
            return node;
        });

        Node result = nodeService.create("New Node", NodeType.DATABASE, 50.0f, 75.0f, 1L);

        assertThat(result.getName()).isEqualTo("New Node");
        assertThat(result.getType()).isEqualTo(NodeType.DATABASE);
        assertThat(result.getXPos()).isEqualTo(50.0f);
        assertThat(result.getYPos()).isEqualTo(75.0f);
        assertThat(result.getProject()).isEqualTo(testProject);
        verify(nodeRepository).save(any(Node.class));
    }

    @Test
    @DisplayName("Should throw exception when project not found during creation")
    void shouldThrowExceptionWhenProjectNotFound() {
        when(projectRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> nodeService.create("Node", NodeType.SERVICE, 0f, 0f, 999L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Project not found");
    }

    @Test
    @DisplayName("Should update node successfully")
    void shouldUpdateNodeSuccessfully() {
        when(nodeRepository.findById(1L)).thenReturn(Optional.of(testNode));
        when(nodeRepository.save(any(Node.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Optional<Node> result = nodeService.update(1L, "Updated Name", NodeType.GATEWAY, 150.0f, 250.0f, null);

        assertThat(result).isPresent();
        assertThat(result.get().getName()).isEqualTo("Updated Name");
        assertThat(result.get().getType()).isEqualTo(NodeType.GATEWAY);
        assertThat(result.get().getXPos()).isEqualTo(150.0f);
        assertThat(result.get().getYPos()).isEqualTo(250.0f);
    }

    @Test
    @DisplayName("Should return empty when updating nonexistent node")
    void shouldReturnEmptyWhenUpdatingNonexistentNode() {
        when(nodeRepository.findById(999L)).thenReturn(Optional.empty());

        Optional<Node> result = nodeService.update(999L, "Name", null, null, null, null);

        assertThat(result).isEmpty();
        verify(nodeRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should delete node successfully")
    void shouldDeleteNodeSuccessfully() {
        when(nodeRepository.findById(1L)).thenReturn(Optional.of(testNode));

        Optional<Node> result = nodeService.delete(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getId()).isEqualTo(1L);
        verify(nodeRepository).delete(testNode);
    }

    @Test
    @DisplayName("Should return empty when deleting nonexistent node")
    void shouldReturnEmptyWhenDeletingNonexistentNode() {
        when(nodeRepository.findById(999L)).thenReturn(Optional.empty());

        Optional<Node> result = nodeService.delete(999L);

        assertThat(result).isEmpty();
        verify(nodeRepository, never()).delete(any());
    }

    @Test
    @DisplayName("Should delete multiple nodes")
    void shouldDeleteMultipleNodes() {
        Node node2 = new Node();
        node2.setId(2L);
        node2.setName("Node 2");

        when(nodeRepository.findAllById(List.of(1L, 2L))).thenReturn(List.of(testNode, node2));

        List<Node> result = nodeService.deleteAll(List.of(1L, 2L));

        assertThat(result).hasSize(2);
        verify(nodeRepository).deleteAll(List.of(testNode, node2));
    }
}
