import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@apollo/client/react';
import { GET_USER_PROJECTS } from '@/features/projects/api/queries';
import type { ProjectMember } from '@/features/projects/types';
import { PageTransition } from '@/components/PageTransition';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowRight,
  Clock,
  FolderPlus,
  GitBranch,
  Globe,
  Lock,
  Plus,
  Search,
  Settings,
  Share2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { CreateProjectDialog } from '@/components/CreateProjectDialog';
import { ProjectSettingsDialog } from '@/features/projects/components/ProjectSettingsDialog';
import { formatRelativeTime } from '@/utils/format-time';

const roleBadgeVariant: Record<string, { className: string; label: string }> = {
  OWNER: { className: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25', label: 'Owner' },
  EDITOR: { className: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/25', label: 'Editor' },
  VIEWER: { className: 'bg-zinc-500/15 text-zinc-600 dark:text-zinc-400 border-zinc-500/25', label: 'Viewer' },
};

export default function Dashboard() {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [settingsProject, setSettingsProject] = useState<{
    id: number;
    name: string;
    description?: string | null;
    isPublic?: boolean;
  } | null>(null);

  const { loading, error, data } = useQuery<{ userById: { projectMemberships: ProjectMember[] } }>(
    GET_USER_PROJECTS,
    {
      variables: { userId: user?.id },
      skip: !user?.id,
    }
  );

  const projects = useMemo(
    () => data?.userById?.projectMemberships || [],
    [data]
  );

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    const q = searchQuery.toLowerCase();
    return projects.filter(
      (m) =>
        m.project.name.toLowerCase().includes(q) ||
        m.project.description?.toLowerCase().includes(q)
    );
  }, [projects, searchQuery]);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-9 w-32" />
        </div>

        {/* Card grid skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-5 w-14 rounded-full" />
                </div>
                <Skeleton className="mt-2 h-4 w-full" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-14" />
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t pt-4">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-8 w-16" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-24 text-center">
        <p className="text-destructive">Failed to load projects. Please try again.</p>
      </div>
    );
  }

  return (
    <>
      <PageTransition className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground">
              {projects.length} project{projects.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Button>
        </div>

        {/* Search — only shown when there are projects */}
        {projects.length > 0 && (
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        )}

        {/* Empty state */}
        {projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Card className="flex flex-col items-center justify-center py-16 border-dashed">
              <CardContent className="flex flex-col items-center text-center space-y-4">
                <motion.div
                  className="rounded-full bg-primary/10 p-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <FolderPlus className="h-8 w-8 text-primary" />
                </motion.div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">No projects yet</h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Create your first project to start designing system architectures.
                  </p>
                </div>
                <Button size="lg" onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Create Your First Project
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            No projects match "{searchQuery}"
          </div>
        ) : (
          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.06 } },
            }}
          >
            <AnimatePresence>
              {filteredProjects.map((membership) => {
                const { project } = membership;
                const nodeCount = project.nodes?.length ?? 0;
                const edgeCount = project.edges?.length ?? 0;
                const role = roleBadgeVariant[membership.projectRole] ?? roleBadgeVariant.VIEWER;

                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
                    whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
                  >
                    <Card
                      className="group flex flex-col transition-shadow duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-lg leading-snug">
                            {project.name}
                          </CardTitle>
                          <div className="flex shrink-0 items-center gap-1.5">
                            {membership.projectRole === 'OWNER' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                onClick={() => setSettingsProject(project)}
                              >
                                <Settings className="h-3.5 w-3.5" />
                                <span className="sr-only">Project settings</span>
                              </Button>
                            )}
                            <Badge
                              variant="outline"
                              className={`text-xs ${role.className}`}
                            >
                              {role.label}
                            </Badge>
                          </div>
                        </div>
                        {project.description && (
                          <CardDescription className="line-clamp-2 mt-1">
                            {project.description}
                          </CardDescription>
                        )}
                      </CardHeader>

                      <CardContent>
                        {/* Stats row */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5">
                            <Share2 className="h-3.5 w-3.5" />
                            {nodeCount} node{nodeCount !== 1 ? 's' : ''}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <GitBranch className="h-3.5 w-3.5" />
                            {edgeCount} edge{edgeCount !== 1 ? 's' : ''}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            {project.isPublic ? (
                              <Globe className="h-3.5 w-3.5" />
                            ) : (
                              <Lock className="h-3.5 w-3.5" />
                            )}
                            {project.isPublic ? 'Public' : 'Private'}
                          </span>
                        </div>
                      </CardContent>

                      <CardFooter className="flex items-center justify-between border-t pt-4">
                        {project.updatedAt && (
                          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatRelativeTime(project.updatedAt)}
                          </span>
                        )}
                        <Button
                          asChild
                          size="sm"
                          variant="ghost"
                          className="ml-auto group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        >
                          <Link to={`/editor/${project.id}`}>
                            Open
                            <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </PageTransition>

      <CreateProjectDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />

      {settingsProject && (
        <ProjectSettingsDialog
          open={!!settingsProject}
          onOpenChange={(open) => {
            if (!open) setSettingsProject(null);
          }}
          project={settingsProject}
        />
      )}
    </>
  );
}
