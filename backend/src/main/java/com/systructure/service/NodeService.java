package com.systructure.service;

import com.systructure.model.Node;
import com.systructure.model.NodeType;
import com.systructure.model.Project;
import com.systructure.repository.NodeRepository;
import com.systructure.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NodeService {

    private final NodeRepository nodeRepository;
    private final ProjectRepository projectRepository;

    public Optional<Node> findById(Long id) {
        return nodeRepository.findById(id);
    }

    public List<Node> findAll() {
        return nodeRepository.findAll();
    }

    @Transactional
    public Node create(String name, NodeType type, Float xPos, Float yPos, Long projectId) {
        Node node = new Node();
        node.setName(name);
        node.setType(type);
        node.setXPos(xPos);
        node.setYPos(yPos);

        if (projectId != null) {
            Project project = projectRepository.findById(projectId)
                    .orElseThrow(() -> new IllegalArgumentException("Project not found: " + projectId));
            node.setProject(project);
        }

        return nodeRepository.save(node);
    }

    @Transactional
    public Optional<Node> update(Long id, String name, NodeType type, Float xPos, Float yPos, Long projectId) {
        return nodeRepository.findById(id).map(node -> {
            if (name != null) {
                node.setName(name);
            }
            if (type != null) {
                node.setType(type);
            }
            if (xPos != null) {
                node.setXPos(xPos);
            }
            if (yPos != null) {
                node.setYPos(yPos);
            }
            if (projectId != null) {
                Project project = projectRepository.findById(projectId)
                        .orElseThrow(() -> new IllegalArgumentException("Project not found: " + projectId));
                node.setProject(project);
            }
            return nodeRepository.save(node);
        });
    }

    @Transactional
    public Optional<Node> delete(Long id) {
        return nodeRepository.findById(id).map(node -> {
            nodeRepository.delete(node);
            return node;
        });
    }

    @Transactional
    public List<Node> deleteAll(List<Long> ids) {
        List<Node> nodes = nodeRepository.findAllById(ids);
        nodeRepository.deleteAll(nodes);
        return nodes;
    }
}
