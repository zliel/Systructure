package com.systructure.service;

import com.systructure.model.Edge;
import com.systructure.model.Node;
import com.systructure.model.Project;
import com.systructure.repository.EdgeRepository;
import com.systructure.repository.NodeRepository;
import com.systructure.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EdgeService {

    private final EdgeRepository edgeRepository;
    private final NodeRepository nodeRepository;
    private final ProjectRepository projectRepository;
    private final AuthorizationService authorizationService;

    public Optional<Edge> findById(Long id) {
        return edgeRepository.findById(id);
    }

    public List<Edge> findAll() {
        return edgeRepository.findAll();
    }

    @Transactional
    public Edge create(Long sourceNodeId, Long targetNodeId, Long projectId) {
        authorizationService.requireEditPermission(projectId);

        Node sourceNode = nodeRepository.findById(sourceNodeId)
                .orElseThrow(() -> new IllegalArgumentException("Source node not found: " + sourceNodeId));
        Node targetNode = nodeRepository.findById(targetNodeId)
                .orElseThrow(() -> new IllegalArgumentException("Target node not found: " + targetNodeId));
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found: " + projectId));

        Edge edge = new Edge();
        edge.setSourceNode(sourceNode);
        edge.setTargetNode(targetNode);
        edge.setProject(project);

        return edgeRepository.save(edge);
    }

    @Transactional
    public Optional<Edge> update(Long id, Long sourceNodeId, Long targetNodeId, Long projectId) {
        return edgeRepository.findById(id).map(edge -> {
            if (edge.getProject() != null) {
                authorizationService.requireEditPermission(edge.getProject().getId());
            }

            if (sourceNodeId != null) {
                Node sourceNode = nodeRepository.findById(sourceNodeId)
                        .orElseThrow(() -> new IllegalArgumentException("Source node not found: " + sourceNodeId));
                edge.setSourceNode(sourceNode);
            }
            if (targetNodeId != null) {
                Node targetNode = nodeRepository.findById(targetNodeId)
                        .orElseThrow(() -> new IllegalArgumentException("Target node not found: " + targetNodeId));
                edge.setTargetNode(targetNode);
            }
            if (projectId != null) {
                authorizationService.requireEditPermission(projectId);
                Project project = projectRepository.findById(projectId)
                        .orElseThrow(() -> new IllegalArgumentException("Project not found: " + projectId));
                edge.setProject(project);
            }
            return edgeRepository.save(edge);
        });
    }

    @Transactional
    public Optional<Edge> delete(Long id) {
        return edgeRepository.findById(id).map(edge -> {
            if (edge.getProject() != null) {
                authorizationService.requireEditPermission(edge.getProject().getId());
            }
            edgeRepository.delete(edge);
            return edge;
        });
    }

    @Transactional
    public List<Edge> deleteAll(List<Long> ids) {
        List<Edge> edges = edgeRepository.findAllById(ids);
        edges.stream()
                .filter(edge -> edge.getProject() != null)
                .map(edge -> edge.getProject().getId())
                .distinct()
                .forEach(authorizationService::requireEditPermission);

        edgeRepository.deleteAll(edges);
        return edges;
    }
}
