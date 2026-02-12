package com.systructure.controller;

import com.systructure.model.Node;
import com.systructure.model.NodeType;
import com.systructure.service.NodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class NodeController {

    private final NodeService nodeService;

    @QueryMapping
    public Node nodeById(@Argument Long id) {
        return nodeService.findById(id).orElse(null);
    }

    @MutationMapping
    public Node createNode(@Argument NodeInput newNodeData) {
        return nodeService.create(
                newNodeData.name(),
                newNodeData.type(),
                newNodeData.xPos(),
                newNodeData.yPos(),
                newNodeData.projectId()
        );
    }

    @MutationMapping
    public Node updateNode(@Argument Long id, @Argument UpdateNodeInput updatedNodeData) {
        return nodeService.update(
                id,
                updatedNodeData.name(),
                updatedNodeData.type(),
                updatedNodeData.xPos(),
                updatedNodeData.yPos(),
                updatedNodeData.projectId()
        ).orElse(null);
    }

    @MutationMapping
    public Node deleteNode(@Argument Long id) {
        return nodeService.delete(id).orElse(null);
    }

    @MutationMapping
    public List<Node> deleteNodes(@Argument List<Long> ids) {
        return nodeService.deleteAll(ids);
    }

    public record NodeInput(String name, NodeType type, Float xPos, Float yPos, Long projectId) {
    }

    public record UpdateNodeInput(String name, NodeType type, Float xPos, Float yPos, Long projectId) {
    }
}
