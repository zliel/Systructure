import * as React from "react"
import { useState } from "react"
import { ChevronsUpDown, Languages, Plus } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { CreateProjectDialog } from "@/components/CreateProjectDialog"
import type { Project, ProjectMember } from "@/features/projects/types"

export function ProjectSwitcher({
  projects
}: {
  projects: ProjectMember[]
}) {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()
  const { projectId: projectIdParam } = useParams<{ projectId: string }>()

  // Determine active project: prefer URL param, then first project
  const getInitialProject = (): Project | null => {
    if (projectIdParam) {
      const projectId = parseInt(projectIdParam, 10)
      const found = projects.find(p => p.project.id === projectId)
      if (found) return found.project
    }
    return projects.length > 0 ? projects[0].project : null
  }

  const [activeProject, setActiveProject] = React.useState<Project | null>(getInitialProject)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Sync with URL when it changes
  React.useEffect(() => {
    if (projectIdParam) {
      const projectId = parseInt(projectIdParam, 10)
      const found = projects.find(p => p.project.id === projectId)
      if (found && found.project.id !== activeProject?.id) {
        setActiveProject(found.project)
      }
    }
  }, [projectIdParam, projects, activeProject?.id])

  const handleSwitchProject = (project: Project) => {
    setActiveProject(project)
    navigate(`/editor/${project.id}`)
  }

  const handleProjectCreated = (project: { id: number; name: string }) => {
    // Navigate to the newly created project
    navigate(`/editor/${project.id}`)
  }

  // Show "Create Project" button when no projects exist
  if (projects.length === 0 || !activeProject) {
    return (
      <>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              onClick={() => setIsDialogOpen(true)}
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground border border-sidebar-accent-foreground dark:border-gray-900 flex aspect-square size-8 items-center justify-center rounded-lg">
                <Plus size={16} />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Create Project</span>
                <span className="truncate text-xs text-muted-foreground">Get started</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <CreateProjectDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onProjectCreated={handleProjectCreated}
        />
      </>
    )
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="bg-sidebar-primary text-sidebar-primary-foreground border border-sidebar-accent-foreground dark:border-gray-900 flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Languages size="4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{activeProject.name}</span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Projects
              </DropdownMenuLabel>
              {projects.map((project, index) => (
                <DropdownMenuItem
                  key={project.project.id}
                  onClick={() => handleSwitchProject(project.project)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    <Languages className="size-4" />
                  </div>
                  {project.project.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 p-2"
                onClick={() => setIsDialogOpen(true)}
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Plus className="size-4" />
                </div>
                <div className="text-muted-foreground font-medium">Add project</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <CreateProjectDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onProjectCreated={handleProjectCreated}
      />
    </>
  )
}
