import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_USER_PROJECTS } from '@/features/projects/api/queries';
import type { ProjectMember } from '@/features/projects/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { CreateProjectDialog } from '@/components/CreateProjectDialog';

export default function Dashboard() {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { loading, error, data } = useQuery<{ userById: { projectMemberships: ProjectMember[] } }>(
    GET_USER_PROJECTS,
    {
      variables: { userId: user?.id },
      skip: !user?.id,
    }
  );

  if (loading) return <div className="p-6">Loading projects...</div>;
  if (error) return <div className="p-6">Error loading projects</div>;

  const projects = data?.userById?.projectMemberships || [];

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground">Manage your systructure projects.</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Button>
        </div>

        {projects.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-12">
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                You don't have any projects yet. Create your first one to get started!
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Create Your First Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((membership) => (
              <Card key={membership.project.id}>
                <CardHeader>
                  <CardTitle>{membership.project.name}</CardTitle>
                  <CardDescription>Role: {membership.projectRole}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Joined: {new Date(membership.joinedAt).toLocaleDateString()}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link to={`/editor/${membership.project.id}`}>
                      Open Editor <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      <CreateProjectDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}
