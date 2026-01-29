import { useQuery } from '@apollo/client/react';
import { GET_USER } from '@/queries';
import type { User } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { loading, error, data } = useQuery<{ userById: User }>(GET_USER, { variables: { userId: 653 } });

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div>Error loading projects</div>;

  const projects = data?.userById.projectMemberships || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage your systructure projects.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((membership) => (
          <Card key={membership.project.id}>
            <CardHeader>
              <CardTitle>{membership.project.name}</CardTitle>
              <CardDescription>Role: {membership.projectRole}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Joined: {new Date(Number(membership.joinedAt)).toLocaleDateString()}
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
    </div>
  );
}

