package com.systructure.controller;

import com.systructure.model.Edge;
import com.systructure.model.Node;
import com.systructure.repository.EdgeRepository;
import com.systructure.repository.NodeRepository;
import com.systructure.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class EdgeController {
    private final NodeRepository nodeRepository;
    private final EdgeRepository edgeRepository;
    private final ProjectRepository projectRepository;

    @QueryMapping
    public Edge edgeById(@Argument Long id) {
        return edgeRepository.findById(id).orElse(null);
    }

    @QueryMapping
    public List<Edge> allEdges() {
        return edgeRepository.findAll();
    }

    @SchemaMapping
    public Node sourceNode(Edge edge) {
        return nodeRepository.findById(edge.getSourceNode().getId()).orElse(null);
    }

    @SchemaMapping
    public Node targetNode(Edge edge) {
        return nodeRepository.findById(edge.getTargetNode().getId()).orElse(null);
    }

    @MutationMapping
    public Edge createEdge(@Argument EdgeInput newEdgeData) {
        Edge edge = new Edge();
        Node sourceNode = nodeRepository.findById(newEdgeData.sourceNodeId()).orElse(null);
        Node targetNode = nodeRepository.findById(newEdgeData.targetNodeId()).orElse(null);
        edge.setSourceNode(sourceNode);
        edge.setTargetNode(targetNode);
        edge.setProject(projectRepository.findById(newEdgeData.projectId()).orElse(null));
        return edgeRepository.save(edge);
    }

    public record EdgeInput(Long sourceNodeId, Long targetNodeId, Long projectId) {
    }
}
