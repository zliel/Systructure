package com.systructure.controller;

import com.systructure.model.Edge;
import com.systructure.model.Node;
import com.systructure.service.EdgeService;
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

    private final EdgeService edgeService;

    @QueryMapping
    public Edge edgeById(@Argument Long id) {
        return edgeService.findById(id).orElse(null);
    }

    @QueryMapping
    public List<Edge> allEdges() {
        return edgeService.findAll();
    }

    @SchemaMapping
    public Node sourceNode(Edge edge) {
        return edge.getSourceNode();
    }

    @SchemaMapping
    public Node targetNode(Edge edge) {
        return edge.getTargetNode();
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

