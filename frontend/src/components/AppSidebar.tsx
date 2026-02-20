import * as React from "react"
import { useState } from "react"
import {
  Server,
  MessageSquare,
  Network,
  Database,
  Container,
  ArrowLeft,
  Loader2,
  Settings,
} from "lucide-react"

import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/features/auth/contexts/AuthContext"

import { NavUser } from "@/components/nav-user"
import { ProjectSwitcher } from "@/components/project-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { memo } from "react"
import { Button } from "./ui/button"
import { useQuery } from "@apollo/client/react"
import { GET_USER_PROJECTS } from "@/features/projects/api/queries"
import type { ProjectMember } from "@/features/projects/types"
import { ProjectSettingsDialog } from "@/features/projects/components/ProjectSettingsDialog"
import { Link } from "react-router-dom"

// Toolbox items for dragging
const toolboxItems = [
  { type: 'SERVICE', label: 'Service', icon: Server },
  { type: 'DATABASE', label: 'Database', icon: Database },
  { type: 'QUEUE', label: 'Queue', icon: MessageSquare },
  { type: 'GATEWAY', label: 'Gateway', icon: Network },
]

interface SidebarProps {
  onDragStart: (event: React.DragEvent, nodeType: string) => void
  onDoubleClick: (nodeType: string) => void
  canEdit?: boolean
  canManage?: boolean
  projectId?: number
}

export const AppSidebar = memo(function AppSidebar({ onDragStart, onDoubleClick, canEdit = true, canManage = false, projectId }: SidebarProps) {
  const { user } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Fetch user's projects using the authenticated user's ID
  const { loading, data } = useQuery<{ userById: { projectMemberships: ProjectMember[] } }>(
    GET_USER_PROJECTS,
    {
      variables: { userId: user?.id },
      skip: !user?.id, // Don't run query if no user
    }
  );

  if (!user) {
    return (
      <Sidebar collapsible="icon">
        <SidebarContent className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </SidebarContent>
      </Sidebar>
    );
  }

  if (loading) {
    return (
      <Sidebar collapsible="icon">
        <SidebarContent className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </SidebarContent>
      </Sidebar>
    );
  }

  const projects = data?.userById?.projectMemberships ?? [];

  // Derive the current project for the settings dialog
  const currentProject = projectId
    ? projects.find((m) => Number(m.project.id) === projectId)?.project
    : undefined;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="group-data-[collapsible=icon]:items-center">
        <div className="flex w-full items-center justify-between group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:gap-2">

          <Button
            asChild
            variant="ghost"
            size="icon"
            className="h-7 w-7"
          >
            <Link to="/dashboard">
              <ArrowLeft className="size-4" />
              <span className="sr-only">Back to dashboard</span>
            </Link>
          </Button>
          <ProjectSwitcher projects={projects} />
          <div className="flex items-center gap-1 group-data-[collapsible=icon]:flex-col">
            <SidebarTrigger />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{canEdit ? 'Components' : 'Components (View Only)'}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolboxItems.map((item) => (
                <SidebarMenuItem key={item.type}>
                  <SidebarMenuButton
                    tooltip={canEdit ? item.label : `${item.label} (view only)`}
                    className={canEdit
                      ? "cursor-grab active:cursor-grabbing border border-sidebar-border mb-2"
                      : "cursor-default border border-sidebar-border mb-2 opacity-50"
                    }
                    draggable={canEdit}
                    onDragStart={canEdit ? (e) => onDragStart(e, item.type) : undefined}
                    onDoubleClick={canEdit ? () => onDoubleClick && onDoubleClick(item.type) : undefined}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent >
      <SidebarFooter>
        <div className="flex flex-col gap-2 mb-4">
          {/* Row 1: Settings + Theme Toggle */}
          <div className="flex group-data-[collapsible=icon]:flex-col items-center gap-2">
            {canManage && (
              <Button
                variant="outline"
                className="flex-1 justify-start gap-2 overflow-hidden hover:border-primary/40 hover:text-primary group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-1.5!"
                onClick={() => setSettingsOpen(true)}
              >
                <Settings className="size-5 shrink-0" />
                <span className="truncate">Settings</span>
              </Button>
            )}
            <ThemeToggle />
          </div>
          {/* Row 2: Docker Compose */}
          <Button variant="outline" className="justify-start gap-2 overflow-hidden hover:border-primary/40 hover:text-primary group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-1.5!" >
            <Container className="size-5 shrink-0 group-data-[collapsible=icon]:pr-0.5! group-data-[collapsible=icon]:pb-0.5!" />
            <span className="truncate">Docker Compose</span>
          </Button>
        </div>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />

      {canManage && currentProject && (
        <ProjectSettingsDialog
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          project={currentProject}
        />
      )}
    </Sidebar >
  )
})
