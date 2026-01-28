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

export const Role = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;
export type Role = typeof Role[keyof typeof Role];

export interface User {
  id: number;
  role: Role;
  username: string;
  email: string;
  projectMemberships: ProjectMember[];
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  nodes: Node[];
  edges: Edge[];
  createdBy: User;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  projectMembers: ProjectMember[];
}

export const ProjectRole = {
  OWNER: 'OWNER',
  EDITOR: 'EDITOR',
  VIEWER: 'VIEWER',
} as const;
export type ProjectRole = typeof ProjectRole[keyof typeof ProjectRole];

export interface ProjectMember {
  id: number;
  project: Project;
  user: User;
  projectRole: ProjectRole;
  joinedAt: string;
}
