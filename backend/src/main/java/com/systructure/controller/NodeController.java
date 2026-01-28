package com.systructure.controller;

import com.systructure.model.Node;
import com.systructure.model.NodeType;
import com.systructure.repository.EdgeRepository;
import com.systructure.repository.NodeRepository;
import com.systructure.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class NodeController {

    private final NodeRepository nodeRepository;
    private final EdgeRepository edgeRepository;
    private final ProjectRepository projectRepository;

    @QueryMapping
    public Node nodeById(@Argument Long id) {
        return nodeRepository.findById(id).orElse(null);
    }

    @QueryMapping
    public List<Node> allNodes() {
        return nodeRepository.findAll();
    }

    @MutationMapping
    public Node createNode(@Argument NodeInput newNodeData) {
        Node node = new Node();
        node.setName(newNodeData.name());
        node.setType(newNodeData.type());
        node.setXPos(newNodeData.xPos());
        node.setYPos(newNodeData.yPos());
        node.setProject(projectRepository.findById(newNodeData.projectId()).orElse(null));
        return nodeRepository.save(node);
    }

    @MutationMapping
    public Node updateNode(@Argument Long id, @Argument UpdateNodeInput updatedNodeData) {
        Node node = nodeRepository.findById(id).orElse(null);
        if (node == null) {
            return null;
        }
        if (updatedNodeData.name() != null) {
            node.setName(updatedNodeData.name());
        }
        if (updatedNodeData.type() != null) {
            node.setType(updatedNodeData.type());
        }
        if (updatedNodeData.xPos() != null) {
            node.setXPos(updatedNodeData.xPos());
        }
        if (updatedNodeData.yPos() != null) {
            node.setYPos(updatedNodeData.yPos());
        }
        if (updatedNodeData.projectId() != null) {
            node.setProject(projectRepository.findById(updatedNodeData.projectId()).orElse(null));
        }
        return nodeRepository.save(node);
    }

    @MutationMapping
    public Node deleteNode(@Argument Long id) {
        Node node = nodeRepository.findById(id).orElse(null);
        if (node != null) {
            nodeRepository.delete(node);
        }
        return node;
    }

    @MutationMapping
    public List<Node> deleteNodes(@Argument List<Long> ids) {
        List<Node> nodes = nodeRepository.findAllById(ids);
        nodeRepository.deleteAll(nodes);
        return nodes;
    }

    public record NodeInput(String name, NodeType type, Float xPos, Float yPos, Long projectId) {
    }

    public record UpdateNodeInput(String name, NodeType type, Float xPos, Float yPos, Long projectId) {
    }
}
