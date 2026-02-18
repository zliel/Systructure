import { useMutation, useQuery } from '@apollo/client/react';
import { Crown, Eye, MoreHorizontal, Shield, Trash2, UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { GET_PROJECT_MEMBERS } from '@/features/projects/api/queries';
import { UPDATE_PROJECT_MEMBER_ROLE, REMOVE_PROJECT_MEMBER } from '@/features/projects/api/mutations';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { toast } from 'sonner';

const roleConfig: Record<string, { icon: typeof Crown; className: string; label: string }> = {
  OWNER: {
    icon: Crown,
    className: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25',
    label: 'Owner',
  },
  EDITOR: {
    icon: Shield,
    className: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/25',
    label: 'Editor',
  },
  VIEWER: {
    icon: Eye,
    className: 'bg-zinc-500/15 text-zinc-600 dark:text-zinc-400 border-zinc-500/25',
    label: 'Viewer',
  },
};

interface MemberData {
  id: number;
  projectRole: string;
  joinedAt: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

interface MemberListProps {
  projectId: number;
  onInvite: () => void;
}

export function MemberList({ projectId, onInvite }: MemberListProps) {
  const { user: currentUser } = useAuth();

  const { loading, data } = useQuery<{
    projectMembershipsByProjectId: MemberData[];
  }>(GET_PROJECT_MEMBERS, {
    variables: { projectId },
  });

  const refetchConfig = {
    refetchQueries: [{ query: GET_PROJECT_MEMBERS, variables: { projectId } }],
  };

  const [updateRole] = useMutation(UPDATE_PROJECT_MEMBER_ROLE, {
    ...refetchConfig,
    onCompleted: () => toast.success('Role updated'),
    onError: (err) => toast.error('Failed to update role: ' + err.message),
  });

  const [removeMember] = useMutation(REMOVE_PROJECT_MEMBER, {
    ...refetchConfig,
    onCompleted: () => toast.success('Member removed'),
    onError: (err) => toast.error('Failed to remove member: ' + err.message),
  });

  if (loading) {
    return (
      <div className="space-y-3 py-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-5 w-14" />
          </div>
        ))}
      </div>
    );
  }

  const members = data?.projectMembershipsByProjectId ?? [];

  // Is the current user the owner?
  const currentUserId = String(currentUser?.id ?? '');
  const isCurrentUserOwner = members.some(
    (m) => String(m.user.id) === currentUserId && m.projectRole === 'OWNER'
  );

  const handleChangeRole = (memberId: number, newRole: 'EDITOR' | 'VIEWER') => {
    updateRole({ variables: { input: { memberId, role: newRole } } });
  };

  const handleRemove = (memberId: number) => {
    removeMember({ variables: { memberId } });
  };

  return (
    <div className="space-y-4 py-2">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {members.length} member{members.length !== 1 ? 's' : ''}
        </p>
        <Button size="sm" variant="outline" onClick={onInvite} className="gap-1.5">
          <UserPlus className="size-3.5" />
          Invite
        </Button>
      </div>

      <div className="divide-y divide-border rounded-lg border">
        {members.map((member) => {
          const config = roleConfig[member.projectRole] ?? roleConfig.VIEWER;
          const RoleIcon = config.icon;
          const isSelf = String(member.user.id) === currentUserId;
          const isOwner = member.projectRole === 'OWNER';

          return (
            <div
              key={member.id}
              className="flex items-center gap-3 px-3 py-2.5"
            >
              {/* Avatar placeholder */}
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium uppercase">
                {member.user.username?.charAt(0) ?? '?'}
              </div>

              {/* User info */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {member.user.username}
                  {isSelf && (
                    <span className="ml-1.5 text-xs text-muted-foreground">(you)</span>
                  )}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {member.user.email}
                </p>
              </div>

              {/* Role badge */}
              <Badge variant="outline" className={`shrink-0 gap-1 text-xs ${config.className}`}>
                <RoleIcon className="size-3" />
                {config.label}
              </Badge>

              {/* Actions (owner only, can't modify self or other owners) */}
              {isCurrentUserOwner && !isSelf && !isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-7">
                      <MoreHorizontal className="size-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {member.projectRole !== 'EDITOR' && (
                      <DropdownMenuItem onClick={() => handleChangeRole(member.id, 'EDITOR')}>
                        <Shield className="mr-2 size-3.5" />
                        Make Editor
                      </DropdownMenuItem>
                    )}
                    {member.projectRole !== 'VIEWER' && (
                      <DropdownMenuItem onClick={() => handleChangeRole(member.id, 'VIEWER')}>
                        <Eye className="mr-2 size-3.5" />
                        Make Viewer
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleRemove(member.id)}
                    >
                      <Trash2 className="mr-2 size-3.5" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          );
        })}

        {members.length === 0 && (
          <div className="py-6 text-center text-sm text-muted-foreground">
            No members yet
          </div>
        )}
      </div>
    </div>
  );
}
