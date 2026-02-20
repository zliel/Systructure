import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/features/auth/contexts/AuthContext';

interface AccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AccountDialog({ open, onOpenChange }: AccountDialogProps) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-100">
        <DialogHeader>
          <DialogTitle>Account</DialogTitle>
          <DialogDescription>
            Your account details.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          <Avatar className="h-20 w-20 rounded-full">
            <AvatarImage alt={user.username} />
            <AvatarFallback className="rounded-full text-2xl">
              {user.username[0].toLocaleUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="text-center space-y-1">
            <p className="text-lg font-semibold">{user.username}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>

          <Badge variant="outline" className="capitalize">
            {user.role.toLowerCase()}
          </Badge>
        </div>
      </DialogContent>
    </Dialog>
  );
}

