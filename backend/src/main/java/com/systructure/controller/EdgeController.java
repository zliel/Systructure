package com.systructure.controller;

import com.systructure.model.Edge;
import com.systructure.model.Node;
import com.systructure.repository.NodeRepository;
import com.systructure.service.EdgeService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.BatchMapping;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
public class EdgeController {

    private final EdgeService edgeService;
    private final NodeRepository nodeRepository;

    @QueryMapping
    public Edge edgeById(@Argument Long id) {
        return edgeService.findById(id).orElse(null);
    }

    @BatchMapping
    public Map<Edge, Node> sourceNode(List<Edge> edges) {
        Set<Long> nodeIds = edges.stream()
                .map(e -> e.getSourceNode().getId())
                .collect(Collectors.toSet());
        Map<Long, Node> nodeMap = nodeRepository.findAllById(nodeIds).stream()
                .collect(Collectors.toMap(Node::getId, n -> n));
        return edges.stream().collect(Collectors.toMap(
                e -> e,
                e -> nodeMap.get(e.getSourceNode().getId())
        ));
    }

    @BatchMapping
    public Map<Edge, Node> targetNode(List<Edge> edges) {
        Set<Long> nodeIds = edges.stream()
                .map(e -> e.getTargetNode().getId())
                .collect(Collectors.toSet());
        Map<Long, Node> nodeMap = nodeRepository.findAllById(nodeIds).stream()
                .collect(Collectors.toMap(Node::getId, n -> n));
        return edges.stream().collect(Collectors.toMap(
                e -> e,
                e -> nodeMap.get(e.getTargetNode().getId())
        ));
    }

    @MutationMapping
    public Edge createEdge(@Argument EdgeInput newEdgeData) {
        return edgeService.create(
                newEdgeData.sourceNodeId(),
                newEdgeData.targetNodeId(),
                newEdgeData.projectId()
        );
    }

    @MutationMapping
    public Edge updateEdge(@Argument Long id, @Argument UpdateEdgeInput updatedEdgeData) {
        return edgeService.update(
                id,
                updatedEdgeData.sourceNodeId(),
                updatedEdgeData.targetNodeId(),
                updatedEdgeData.projectId()
        ).orElse(null);
    }

    @MutationMapping
    public Edge deleteEdge(@Argument Long id) {
        return edgeService.delete(id).orElse(null);
    }

    @MutationMapping
    public List<Edge> deleteEdges(@Argument List<Long> ids) {
        return edgeService.deleteAll(ids);
    }

    public record EdgeInput(Long sourceNodeId, Long targetNodeId, Long projectId) {
    }

    public record UpdateEdgeInput(Long sourceNodeId, Long targetNodeId, Long projectId) {
    }
}
