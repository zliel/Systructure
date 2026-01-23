export const NodeType = {
  DATABASE: 'DATABASE',
  GATEWAY: 'GATEWAY',
  QUEUE: 'QUEUE',
  SERVICE: 'SERVICE'
} as const;
export type NodeType = typeof NodeType[keyof typeof NodeType];

export interface Node {
  id: Number;
  type: NodeType;
  name: String;
  xPos: Number;
  yPos: Number;
}

export interface Edge {
  id: Number;
  sourceNodeId: Number;
  targetNodeId: Number;
}

export const Role = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;
export type Role = typeof Role[keyof typeof Role];

export interface User {
  id: Number;
  role: Role;
  username: String;
  email: String;
  projectMemberships: ProjectMember[];
}

export interface Project {
  id: Number;
  name: String;
  description?: String;
  nodes: Node[];
  edges: Edge[];
  createdBy: User;
  createdAt: String;
  updatedAt: String;
  isPublic: Boolean;
  projectMembers: ProjectMember[];
}

export const ProjectRole = {
  OWNER: 'OWNER',
  EDITOR: 'EDITOR',
  VIEWER: 'VIEWER',
} as const;
export type ProjectRole = typeof ProjectRole[keyof typeof ProjectRole];

export interface ProjectMember {
  id: Number;
  project: Project;
  user: User;
  projectRole: ProjectRole;
  joinedAt: String;
}
