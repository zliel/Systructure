import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { Loader2 } from 'lucide-react';

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
import { CREATE_PROJECT } from '@/features/projects/api/queries';
import { GET_USER_PROJECTS } from '@/features/projects/api/queries';
import { useAuth } from '@/features/auth/contexts/AuthContext';

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreated?: (project: { id: number; name: string }) => void;
}

export function CreateProjectDialog({
  open,
  onOpenChange,
  onProjectCreated,
}: CreateProjectDialogProps) {
  const { user } = useAuth();
  const [projectName, setProjectName] = useState('');

  const [createProject, { loading: isCreating }] = useMutation<
    { createProject: { id: number; name: string } },
    { input: { name: string; description?: string; isPublic?: boolean } }
  >(CREATE_PROJECT, {
    refetchQueries: [
      { query: GET_USER_PROJECTS, variables: { userId: user?.id } }
    ],
    onCompleted: (data) => {
      onOpenChange(false);
      setProjectName('');
      if (data.createProject && onProjectCreated) {
        onProjectCreated(data.createProject);
      }
    },
  });

  const handleCreateProject = async () => {
    if (!projectName.trim()) return;

    await createProject({
      variables: {
        input: {
          name: projectName.trim(),
          isPublic: false,
        }
      }
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset form when closing
      setProjectName('');
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Create a new project</DialogTitle>
          <DialogDescription>
            Give your project a name to get started.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="project-name">Project name</Label>
              <span className={`text-xs tabular-nums transition-colors ${projectName.length >= 50
                ? 'text-red-500'
                : projectName.length > 40
                  ? 'text-yellow-500'
                  : 'text-muted-foreground'
                }`}>
                {projectName.length}/50
              </span>
            </div>
            <Input
              id="project-name"
              placeholder="My Awesome Project"
              value={projectName}
              onChange={(e) => {
                if (e.target.value.length <= 50) {
                  setProjectName(e.target.value);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isCreating && projectName.trim()) {
                  handleCreateProject();
                }
              }}
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateProject} disabled={isCreating || !projectName.trim()}>
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Project'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
