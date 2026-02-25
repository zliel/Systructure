import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { UPDATE_PROFILE } from '@/features/auth/api/mutations';
import type { AuthUser } from '@/features/auth/types';

const usernameSchema = z.object({
  username: z
    .string()
    .min(2, 'Username must be at least 2 characters')
    .max(50, 'Username must be at most 50 characters'),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type UsernameFormData = z.infer<typeof usernameSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

interface AccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AccountDialog({ open, onOpenChange }: AccountDialogProps) {
  const { user, updateUser } = useAuth();
  const [passwordOpen, setPasswordOpen] = useState(false);

  const {
    register: registerUsername,
    handleSubmit: handleUsernameSubmit,
    formState: { errors: usernameErrors, isDirty: isUsernameDirty },
    reset: resetUsername,
  } = useForm<UsernameFormData>({
    resolver: zodResolver(usernameSchema),
    defaultValues: { username: user?.username ?? '' },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const [updateProfile, { loading }] = useMutation<{ updateProfile: AuthUser }>(UPDATE_PROFILE);

  const onUsernameSubmit = async (data: UsernameFormData) => {
    try {
      const { data: result } = await updateProfile({
        variables: { input: { username: data.username } },
      });
      if (result?.updateProfile) {
        updateUser(result.updateProfile);
        resetUsername({ username: result.updateProfile.username });
        toast.success('Username updated');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update username';
      toast.error(message);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      await updateProfile({
        variables: {
          input: {
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
          },
        },
      });
      resetPassword();
      setPasswordOpen(false);
      toast.success('Password updated');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update password';
      toast.error(message);
    }
  };

  if (!user) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          resetUsername({ username: user.username });
          resetPassword();
          setPasswordOpen(false);
        }
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-100">
        <DialogHeader>
          <DialogTitle>Account</DialogTitle>
          <DialogDescription>
            Manage your profile and security settings.
          </DialogDescription>
        </DialogHeader>

        {/* ── Avatar + Email (read-only) ──────────── */}
        <div className="flex items-center gap-3 py-2">
          <Avatar className="h-14 w-14 rounded-full">
            <AvatarImage alt={user.username} />
            <AvatarFallback className="rounded-full text-lg">
              {user.username[0].toLocaleUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-0.5">
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <Badge variant="outline" className="capitalize text-xs">
              {user.role.toLowerCase()}
            </Badge>
          </div>
        </div>

        <Separator />

        <form onSubmit={handleUsernameSubmit(onUsernameSubmit)} className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="account-username">Username</Label>
            <div className="flex gap-2">
              <Input
                id="account-username"
                placeholder="Your username"
                maxLength={50}
                {...registerUsername('username')}
              />
              <Button
                type="submit"
                size="sm"
                disabled={loading || !isUsernameDirty}
                className="shrink-0"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Save'
                )}
              </Button>
            </div>
            {usernameErrors.username && (
              <p className="text-sm text-destructive">
                {usernameErrors.username.message}
              </p>
            )}
          </div>
        </form>

        <Separator />

        <Collapsible open={passwordOpen} onOpenChange={setPasswordOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between font-normal"
            >
              Change Password
              <ChevronDown
                className={`h-4 w-4 transition-transform ${passwordOpen ? 'rotate-180' : ''
                  }`}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <form
              onSubmit={handlePasswordSubmit(onPasswordSubmit)}
              className="space-y-3 pt-2"
            >
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="Enter current password"
                  {...registerPassword('currentPassword')}
                />
                {passwordErrors.currentPassword && (
                  <p className="text-sm text-destructive">
                    {passwordErrors.currentPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password"
                  {...registerPassword('newPassword')}
                />
                {passwordErrors.newPassword && (
                  <p className="text-sm text-destructive">
                    {passwordErrors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm new password"
                  {...registerPassword('confirmPassword')}
                />
                {passwordErrors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {passwordErrors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                size="sm"
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </form>
          </CollapsibleContent>
        </Collapsible>
      </DialogContent>
    </Dialog>
  );
}
