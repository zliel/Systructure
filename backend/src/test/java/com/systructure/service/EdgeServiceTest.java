package com.systructure.service;

import com.systructure.model.Edge;
import com.systructure.model.Node;
import com.systructure.model.NodeType;
import com.systructure.model.Project;
import com.systructure.repository.EdgeRepository;
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
class EdgeServiceTest {

    @Mock
    private EdgeRepository edgeRepository;

    @Mock
    private NodeRepository nodeRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private AuthorizationService authorizationService;

    @InjectMocks
    private EdgeService edgeService;

    private Project testProject;
    private Node sourceNode;
    private Node targetNode;
    private Edge testEdge;

    @BeforeEach
    void setUp() {
        testProject = new Project();
        testProject.setId(1L);
        testProject.setName("Test Project");

        sourceNode = new Node();
        sourceNode.setId(1L);
        sourceNode.setName("Source Node");
        sourceNode.setType(NodeType.SERVICE);

        targetNode = new Node();
        targetNode.setId(2L);
        targetNode.setName("Target Node");
        targetNode.setType(NodeType.DATABASE);

        testEdge = new Edge();
        testEdge.setId(1L);
        testEdge.setSourceNode(sourceNode);
        testEdge.setTargetNode(targetNode);
        testEdge.setProject(testProject);
    }

    @Test
    @DisplayName("Should find edge by ID")
    void shouldFindEdgeById() {
        when(edgeRepository.findById(1L)).thenReturn(Optional.of(testEdge));

        Optional<Edge> result = edgeService.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getSourceNode().getName()).isEqualTo("Source Node");
        assertThat(result.get().getTargetNode().getName()).isEqualTo("Target Node");
        verify(edgeRepository).findById(1L);
    }

    @Test
    @DisplayName("Should return empty when edge not found")
    void shouldReturnEmptyWhenEdgeNotFound() {
        when(edgeRepository.findById(999L)).thenReturn(Optional.empty());

        Optional<Edge> result = edgeService.findById(999L);

        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("Should find all edges")
    void shouldFindAllEdges() {
        when(edgeRepository.findAll()).thenReturn(List.of(testEdge));

        List<Edge> result = edgeService.findAll();

        assertThat(result).hasSize(1);
    }

    @Test
    @DisplayName("Should create edge successfully")
    void shouldCreateEdgeSuccessfully() {
        when(nodeRepository.findById(1L)).thenReturn(Optional.of(sourceNode));
        when(nodeRepository.findById(2L)).thenReturn(Optional.of(targetNode));
        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));
        when(edgeRepository.save(any(Edge.class))).thenAnswer(invocation -> {
            Edge edge = invocation.getArgument(0);
            edge.setId(1L);
            return edge;
        });

        Edge result = edgeService.create(1L, 2L, 1L);

        assertThat(result.getSourceNode()).isEqualTo(sourceNode);
        assertThat(result.getTargetNode()).isEqualTo(targetNode);
        assertThat(result.getProject()).isEqualTo(testProject);
        verify(edgeRepository).save(any(Edge.class));
    }

    @Test
    @DisplayName("Should throw exception when source node not found")
    void shouldThrowExceptionWhenSourceNodeNotFound() {
        when(nodeRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> edgeService.create(999L, 2L, 1L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Source node not found");
    }

    @Test
    @DisplayName("Should throw exception when target node not found")
    void shouldThrowExceptionWhenTargetNodeNotFound() {
        when(nodeRepository.findById(1L)).thenReturn(Optional.of(sourceNode));
        when(nodeRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> edgeService.create(1L, 999L, 1L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Target node not found");
    }

    @Test
    @DisplayName("Should throw exception when project not found during edge creation")
    void shouldThrowExceptionWhenProjectNotFoundDuringEdgeCreation() {
        when(nodeRepository.findById(1L)).thenReturn(Optional.of(sourceNode));
        when(nodeRepository.findById(2L)).thenReturn(Optional.of(targetNode));
        when(projectRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> edgeService.create(1L, 2L, 999L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Project not found");
    }

    @Test
    @DisplayName("Should update edge successfully")
    void shouldUpdateEdgeSuccessfully() {
        Node newTargetNode = new Node();
        newTargetNode.setId(3L);
        newTargetNode.setName("New Target");

        when(edgeRepository.findById(1L)).thenReturn(Optional.of(testEdge));
        when(nodeRepository.findById(3L)).thenReturn(Optional.of(newTargetNode));
        when(edgeRepository.save(any(Edge.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Optional<Edge> result = edgeService.update(1L, null, 3L, null);

        assertThat(result).isPresent();
        assertThat(result.get().getTargetNode()).isEqualTo(newTargetNode);
    }

    @Test
    @DisplayName("Should return empty when updating nonexistent edge")
    void shouldReturnEmptyWhenUpdatingNonexistentEdge() {
        when(edgeRepository.findById(999L)).thenReturn(Optional.empty());

        Optional<Edge> result = edgeService.update(999L, 1L, 2L, 1L);

        assertThat(result).isEmpty();
        verify(edgeRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should delete edge successfully")
    void shouldDeleteEdgeSuccessfully() {
        when(edgeRepository.findById(1L)).thenReturn(Optional.of(testEdge));

        Optional<Edge> result = edgeService.delete(1L);

        assertThat(result).isPresent();
        verify(edgeRepository).delete(testEdge);
    }

    @Test
    @DisplayName("Should return empty when deleting nonexistent edge")
    void shouldReturnEmptyWhenDeletingNonexistentEdge() {
        when(edgeRepository.findById(999L)).thenReturn(Optional.empty());

        Optional<Edge> result = edgeService.delete(999L);

        assertThat(result).isEmpty();
        verify(edgeRepository, never()).delete(any());
    }

    @Test
    @DisplayName("Should delete multiple edges")
    void shouldDeleteMultipleEdges() {
        Edge edge2 = new Edge();
        edge2.setId(2L);

        when(edgeRepository.findAllById(List.of(1L, 2L))).thenReturn(List.of(testEdge, edge2));

        List<Edge> result = edgeService.deleteAll(List.of(1L, 2L));

        assertThat(result).hasSize(2);
        verify(edgeRepository).deleteAll(List.of(testEdge, edge2));
    }
}
