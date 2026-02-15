import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { Loader2, UserPlus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { ADD_PROJECT_MEMBER } from '@/features/projects/api/mutations';
import { GET_PROJECT_MEMBERS } from '@/features/projects/api/queries';

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: number;
}

export function InviteMemberDialog({
  open,
  onOpenChange,
  projectId,
}: InviteMemberDialogProps) {
  const [identifier, setIdentifier] = useState('');
  const [role, setRole] = useState<'EDITOR' | 'VIEWER'>('EDITOR');

  const [addMember, { loading: isSending }] = useMutation(ADD_PROJECT_MEMBER, {
    refetchQueries: [
      { query: GET_PROJECT_MEMBERS, variables: { projectId } },
    ],
    onCompleted: () => {
      toast.success(`Member added successfully`);
      setIdentifier('');
      onOpenChange(false);
    },
    onError: (error) => {
      const msg = error.message;
      if (msg.includes('already a member')) {
        toast.error('This user is already a member of this project.');
      } else if (msg.includes('User not found')) {
        toast.error('No user found with that email or username.');
      } else {
        toast.error('Failed to add member: ' + msg);
      }
    },
  });

  const handleInvite = async () => {
    if (!identifier.trim()) return;

    await addMember({
      variables: {
        input: {
          projectId,
          identifier: identifier.trim(),
          role,
        },
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="size-4" />
            Invite Member
          </DialogTitle>
          <DialogDescription>
            Add a team member to this project.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="invite-identifier">Username or email</Label>
            <Input
              id="invite-identifier"
              placeholder="jane@example.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as 'EDITOR' | 'VIEWER')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EDITOR">Editor — can modify nodes and edges</SelectItem>
                <SelectItem value="VIEWER">Viewer — read-only access</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleInvite}
            disabled={isSending || !identifier.trim()}
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              'Add Member'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
