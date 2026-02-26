import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Globe, Loader2, Lock, Settings, Trash2, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
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
import { UPDATE_PROJECT, DELETE_PROJECT } from '@/features/projects/api/mutations';
import { GET_USER_PROJECTS } from '@/features/projects/api/queries';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { MemberList } from './MemberList';
import { InviteMemberDialog } from './InviteMemberDialog';

const settingsSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

interface ProjectSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: {
    id: number;
    name: string;
    description?: string | null;
    isPublic?: boolean;
  };
}

export function ProjectSettingsDialog({
  open,
  onOpenChange,
  project,
}: ProjectSettingsDialogProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isPublic, setIsPublic] = useState(project.isPublic ?? false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    watch,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: project.name,
      description: project.description ?? '',
    },
  });

  // Reset form when project changes or dialog opens
  useEffect(() => {
    if (open) {
      reset({
        name: project.name,
        description: project.description ?? '',
      });
      setIsPublic(project.isPublic ?? false);
    }
  }, [open, project, reset]);

  const [updateProject, { loading: isSaving }] = useMutation(UPDATE_PROJECT, {
    refetchQueries: [
      { query: GET_USER_PROJECTS, variables: { userId: user?.id } },
    ],
    onCompleted: () => {
      onOpenChange(false);
    },
  });

  const [deleteProject, { loading: isDeleting }] = useMutation(DELETE_PROJECT, {
    onCompleted: () => {
      onOpenChange(false);
      navigate('/dashboard');
      toast.success('Project deleted');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete project');
    },
    refetchQueries: [
      { query: GET_USER_PROJECTS, variables: { userId: user?.id } },
    ],
  });

  const hasChanges = isDirty || isPublic !== (project.isPublic ?? false);

  const onSubmit = async (data: SettingsFormData) => {
    await updateProject({
      variables: {
        id: project.id,
        input: {
          name: data.name,
          description: data.description || null,
          isPublic,
        },
      },
    });
  };

  const handleDeleteProject = async () => {
    await deleteProject({ variables: { id: project.id } });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Project Settings</DialogTitle>
            <DialogDescription>
              Manage your project's settings and team members.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="general" className="mt-1">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general" className="gap-1.5">
                <Settings className="size-3.5" />
                General
              </TabsTrigger>
              <TabsTrigger value="members" className="gap-1.5">
                <Users className="size-3.5" />
                Members
              </TabsTrigger>
            </TabsList>

            {/* ── General Tab ────────────────────────── */}
            <TabsContent value="general">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-3">
                {/* Name */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="project-name">Name</Label>
                    <span className={`text-xs tabular-nums transition-colors ${(watch('name')?.length ?? 0) >= 50
                      ? 'text-red-500'
                      : (watch('name')?.length ?? 0) > 40
                        ? 'text-yellow-500'
                        : 'text-muted-foreground'
                      }`}>
                      {watch('name')?.length ?? 0}/50
                    </span>
                  </div>
                  <Input
                    id="project-name"
                    placeholder="My Project"
                    maxLength={50}
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="project-description">Description</Label>
                  <Textarea
                    id="project-description"
                    placeholder="What is this project about?"
                    rows={3}
                    className="resize-none"
                    {...register('description')}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description.message}</p>
                  )}
                </div>

                {/* Visibility toggle */}
                <div className="space-y-2">
                  <Label>Visibility</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={!isPublic ? 'default' : 'outline'}
                      onClick={() => setIsPublic(false)}
                      className="flex-1"
                    >
                      <Lock className="mr-2 h-3.5 w-3.5" />
                      Private
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={isPublic ? 'default' : 'outline'}
                      onClick={() => setIsPublic(true)}
                      className="flex-1"
                    >
                      <Globe className="mr-2 h-3.5 w-3.5" />
                      Public
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isPublic
                      ? 'Anyone can view this project.'
                      : 'Only members can view this project.'}
                  </p>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSaving || !hasChanges}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </DialogFooter>
              </form>

              <Separator className="my-4" />
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-destructive">Danger Zone</h4>
                <p className="text-xs text-muted-foreground">
                  Deleting a project permanently removes all nodes, edges, and member access.
                  This action cannot be undone.
                </p>
                <AlertDialog onOpenChange={(isOpen) => { if (!isOpen) setDeleteConfirmText(''); }}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="gap-1.5">
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete Project
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete "{project.name}"?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the project and all its data.
                        Type <span className="font-mono font-semibold text-foreground">{project.name}</span> to confirm.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <Input
                      placeholder="Type project name to confirm"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      autoComplete="off"
                    />
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteProject}
                        disabled={deleteConfirmText !== project.name || isDeleting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isDeleting ? (
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Deleting...</>
                        ) : (
                          'Delete Project'
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TabsContent>

            {/* ── Members Tab ────────────────────────── */}
            <TabsContent value="members">
              <MemberList
                projectId={project.id}
                onInvite={() => setInviteOpen(true)}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <InviteMemberDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        projectId={project.id}
      />
    </>
  );
}
