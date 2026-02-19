package com.systructure.repository;

import com.systructure.model.Edge;
import com.systructure.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EdgeRepository extends JpaRepository<Edge, Long> {
    public void deleteBySourceNodeIdOrTargetNodeId(Long sourceNode_id, Long targetNode_id);

    List<Edge> findByProjectIn(List<Project> projects);
}
