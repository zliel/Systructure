export const NodeType = {
    DATABASE: 'DATABASE',
    GATEWAY: 'GATEWAY',
    QUEUE: 'QUEUE',
    SERVICE: 'SERVICE'
} as const;
export type NodeType = typeof NodeType[keyof typeof NodeType];

export interface Node {
    id: number;
    type: NodeType;
    name: string;
    xPos: number;
    yPos: number;
}

export interface NodeInput {
    type: NodeType;
    name: string;
    xPos: number;
    yPos: number;
    projectId: number;
}

export interface UpdateNodeInput {
    type: NodeType;
    name: string;
    xPos: number;
    yPos: number;
    projectId: number;
}

export interface Edge {
    id: number;
    sourceNode: Node;
    targetNode: Node;
}

export interface EdgeInput {
    sourceNodeId: number;
    targetNodeId: number;
    projectId: number;
}
