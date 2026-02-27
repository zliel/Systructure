import { useState, useMemo } from 'react';
import { useMutation } from '@apollo/client/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronDown, Loader2, Shield, Trash2, User } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

import { PageTransition } from '@/components/PageTransition';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { useAuth } from '@/features/auth/contexts/AuthContext';
import { UPDATE_PROFILE, DELETE_ACCOUNT } from '@/features/auth/api/mutations';
import { clearTokens } from '@/features/auth/api/auth';
import { getPasswordStrength } from '@/utils/password-strength';
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
    newPassword: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[0-9]/, 'Must contain a number')
      .regex(/[^a-zA-Z0-9]/, 'Must contain a special character'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type UsernameFormData = z.infer<typeof usernameSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

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
    watch: watchPassword,
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

  const newPasswordValue = watchPassword('newPassword', '');
  const passwordStrength = useMemo(
    () => getPasswordStrength(newPasswordValue),
    [newPasswordValue]
  );

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
    <PageTransition className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Card className="h-fit">
          <CardContent className="flex flex-col items-center pt-6 text-center">
            <Avatar className="h-20 w-20 rounded-full">
              <AvatarImage alt={user.username} />
              <AvatarFallback className="rounded-full text-2xl">
                {user.username[0].toLocaleUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h2 className="mt-3 text-lg font-semibold">{user.username}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <Badge variant="outline" className="mt-2 capitalize text-xs">
              {user.role.toLowerCase()}
            </Badge>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="size-5 text-muted-foreground" />
                <CardTitle>Profile</CardTitle>
              </div>
              <CardDescription>
                Update your display name. Your email is set during registration.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                id="username-form"
                onSubmit={handleUsernameSubmit(onUsernameSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="settings-email">Email</Label>
                  <Input
                    id="settings-email"
                    value={user.email}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Contact support to change your email address.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-username">Username</Label>
                  <Input
                    id="settings-username"
                    placeholder="Your username"
                    maxLength={50}
                    {...registerUsername('username')}
                  />
                  {usernameErrors.username && (
                    <p className="text-sm text-destructive">
                      {usernameErrors.username.message}
                    </p>
                  )}
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-4">
              <Button
                type="submit"
                form="username-form"
                disabled={loading || !isUsernameDirty}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="size-5 text-muted-foreground" />
                <CardTitle>Security</CardTitle>
              </div>
              <CardDescription>
                Manage your password and account security.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Collapsible open={passwordOpen} onOpenChange={setPasswordOpen}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between font-normal"
                  >
                    Change Password
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${passwordOpen ? 'rotate-180' : ''
                        }`}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <form
                    onSubmit={handlePasswordSubmit(onPasswordSubmit)}
                    className="space-y-4 pt-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="settings-current-password">
                        Current Password
                      </Label>
                      <Input
                        id="settings-current-password"
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
                      <Label htmlFor="settings-new-password">
                        New Password
                      </Label>
                      <Input
                        id="settings-new-password"
                        type="password"
                        placeholder="Enter new password"
                        {...registerPassword('newPassword')}
                      />
                      {/* Password strength indicator */}
                      {newPasswordValue.length > 0 && (
                        <div className="space-y-1">
                          <div className="flex gap-1">
                            {[0, 1, 2, 3].map((i) => (
                              <div
                                key={i}
                                className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i < passwordStrength.score
                                  ? passwordStrength.color
                                  : 'bg-muted'
                                  }`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {passwordStrength.label}
                          </p>
                        </div>
                      )}
                      {passwordErrors.newPassword && (
                        <p className="text-sm text-destructive">
                          {passwordErrors.newPassword.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="settings-confirm-password">
                        Confirm New Password
                      </Label>
                      <Input
                        id="settings-confirm-password"
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
            </CardContent>
          </Card>

          <Card className="border-destructive/30">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Trash2 className="size-5 text-destructive" />
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
              </div>
              <CardDescription>
                Permanently delete your account, projects you solely own, and
                all associated data. This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog
                onOpenChange={(isOpen) => {
                  if (!isOpen) setDeletePassword('');
                }}
              >
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="gap-1.5">
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action is irreversible. All your data will be
                      permanently deleted. Enter your password to confirm.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="space-y-2">
                    <Label htmlFor="delete-password">Password</Label>
                    <Input
                      id="delete-password"
                      type="password"
                      placeholder="Enter your password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                    />
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <DeleteAccountButton password={deletePassword} />
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}

function DeleteAccountButton({ password }: { password: string }) {
  const navigate = useNavigate();
  const [deleteAccount, { loading }] = useMutation(DELETE_ACCOUNT, {
    onCompleted: () => {
      clearTokens();
      navigate('/');
      toast.success('Account deleted');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete account');
    },
  });

  return (
    <AlertDialogAction
      onClick={() => deleteAccount({ variables: { password } })}
      disabled={!password || loading}
      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Deleting...
        </>
      ) : (
        'Delete Account'
      )}
    </AlertDialogAction>
  );
}
