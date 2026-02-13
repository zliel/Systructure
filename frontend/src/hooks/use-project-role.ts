import { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { GET_USER_PROJECTS } from '@/features/projects/api/queries';
import type { ProjectMember, ProjectRole } from '@/features/projects/types';

interface UseProjectRoleResult {
  role: ProjectRole | null;
  canEdit: boolean;
  canManage: boolean;
  isLoading: boolean;
}

export function useProjectRole(projectId: number): UseProjectRoleResult {
  const { user } = useAuth();

  const { loading, data } = useQuery<{
    userById: { projectMemberships: ProjectMember[] };
  }>(GET_USER_PROJECTS, {
    variables: { userId: user?.id },
    skip: !user?.id,
  });

  const role = useMemo<ProjectRole | null>(() => {
    if (!data?.userById?.projectMemberships) return null;

    const membership = data.userById.projectMemberships.find(
      (m) => Number(m.project.id) === projectId
    );

    return membership?.projectRole ?? null;
  }, [data, projectId]);

  const canEdit = role === 'OWNER' || role === 'EDITOR';
  const canManage = role === 'OWNER';

  return { role, canEdit, canManage, isLoading: loading };
}
