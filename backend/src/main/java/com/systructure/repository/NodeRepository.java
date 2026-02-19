package com.systructure.repository;

import com.systructure.model.Node;
import com.systructure.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NodeRepository extends JpaRepository<Node, Long> {
    List<Node> findByProjectIn(List<Project> projects);
}
