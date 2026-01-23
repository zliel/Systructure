import { type Node as FlowNode, type Edge as FlowEdge, type XYPosition, Position } from '@xyflow/react';
import type { Node as ProjectNode, Edge as ProjectEdge } from '../types';

export function mapProjectNodesToFlowNodes(projectNodes: ProjectNode[]): FlowNode[] {
  return projectNodes.map((node) => ({
    id: node.id.toString(),
    data: { label: node.name, type: node.type },
    position: { x: node.xPos, y: node.yPos } as XYPosition,
    type: 'default',
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  }));
}

export function mapProjectEdgesToFlowEdges(projectEdges: ProjectEdge[]): FlowEdge[] {
  return projectEdges.map((edge) => ({
    id: edge.id.toString(),
    source: edge.sourceNodeId.toString(),
    target: edge.targetNodeId.toString(),
    animated: true,
  }));
}
