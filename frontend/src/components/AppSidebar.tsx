import * as React from "react"
import {
  Server,
  MessageSquare,
  Network,
  Database,
  Container,
  Loader2
} from "lucide-react"

import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/contexts/AuthContext"

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
import { GET_USER_PROJECTS } from "@/queries"
import type { ProjectMember } from "@/types"

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
}

export const AppSidebar = memo(function AppSidebar({ onDragStart, onDoubleClick }: SidebarProps) {
  const { user } = useAuth();

  const { loading, data } = useQuery<{ userById: { projectMemberships: ProjectMember[] } }>(
    GET_USER_PROJECTS,
    {
      variables: { userId: user?.id },
      skip: !user?.id,
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

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="group-data-[collapsible=icon]:items-center">
        <div className="flex w-full items-center justify-between group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:gap-2">
          <ProjectSwitcher projects={projects} />
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Components</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolboxItems.map((item) => (
                <SidebarMenuItem key={item.type}>
                  <SidebarMenuButton
                    tooltip={item.label}
                    className="cursor-grab active:cursor-grabbing border border-sidebar-border mb-2"
                    draggable
                    onDragStart={(e) => onDragStart(e, item.type)}
                    onDoubleClick={() => onDoubleClick && onDoubleClick(item.type)}
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
        <div className="flex group-data-[collapsible=icon]:flex-col items-center gap-2 mb-4">
          <Button variant="outline" className="flex-1 justify-start gap-2 overflow-hidden hover:border-primary/40 hover:text-primary group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-1.5!" >
            <Container className="size-5 shrink-0" />
            <span className="truncate">Docker Compose</span>
          </Button>
          <ThemeToggle />
        </div>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar >
  )
})
