package com.systructure.repository;

import com.systructure.model.Edge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EdgeRepository extends JpaRepository<Edge, Long> {
    public void deleteBySourceNodeIdOrTargetNodeId(Long sourceNode_id, Long targetNode_id);
}
