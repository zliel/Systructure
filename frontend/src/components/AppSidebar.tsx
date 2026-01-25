import * as React from "react"
import {
  AudioWaveform,
  Frame,
  Map,
  PieChart,
  Languages,
  Server,
  MessageSquare,
  Network,
  Database,
  Container
} from "lucide-react"

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
import { GET_USER } from "@/queries"
import type { User } from "@/types"

// Toolbox items for dragging
const toolboxItems = [
  { type: 'SERVICE', label: 'Service', icon: Server },
  { type: 'DATABASE', label: 'Database', icon: Database },
  { type: 'QUEUE', label: 'Queue', icon: MessageSquare },
  { type: 'GATEWAY', label: 'Gateway', icon: Network },
]

// This is sample data.
const dummyData = {
  user: {
    name: "zliel",
    email: "zpliel@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "LinguaTile",
      logo: Languages,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

interface SidebarProps {
  onDragStart: (event: React.DragEvent, nodeType: string) => void
}

export const AppSidebar = memo(function AppSidebar({ onDragStart }: SidebarProps) {
  const { loading, error, data } = useQuery<{ userById: User }>(GET_USER, { variables: { userId: 203 } });
  console.log("User data:", data);

  if (loading) return <div>Loading...</div>;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="group-data-[collapsible=icon]:items-center">
        <div className="flex w-full items-center justify-between group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:gap-2">
          <ProjectSwitcher projects={data!.userById.projectMemberships} />
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
        <Button variant="outline" className="w-full justify-start gap-2 overflow-hidden mb-4 hover:border-primary/40 hover:text-primary group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-1.5!" >
          <Container className="size-5 shrink-0" />
          <span className="truncate">Docker Compose</span>
        </Button>
        <NavUser user={data!.userById} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar >
  )
})
