import type { User } from '@/types';
import type { Node, Edge } from '@/features/editor/types';

export const ProjectRole = {
    OWNER: 'OWNER',
    EDITOR: 'EDITOR',
    VIEWER: 'VIEWER',
} as const;
export type ProjectRole = typeof ProjectRole[keyof typeof ProjectRole];

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

export interface ProjectMember {
    id: number;
    project: Project;
    user: User;
    projectRole: ProjectRole;
    joinedAt: string;
}
