import * as React from "react"
import {
  AudioWaveform,
  Frame,
  Map,
  PieChart,
  SquareTerminal,
  Languages,
  Server,
  MessageSquare,
  Network,
  ListOrdered,
  Database
} from "lucide-react"

import { NavUser } from "@/components/nav-user"
import { ProjectSwitcher } from "@/components/project-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Card, CardContent } from '@/components/ui/card'
import { memo } from "react"

// Toolbox items for dragging
const toolboxItems = [
  { type: 'SERVICE', label: 'Service', icon: Server },
  { type: 'DATABASE', label: 'Database', icon: Database },
  { type: 'QUEUE', label: 'Queue', icon: MessageSquare },
  { type: 'GATEWAY', label: 'Gateway', icon: Network },
]

// This is sample data.
const data = {
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
  navMain: [
    {
      title: "Service",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Database",
      url: "#",
      icon: Database,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Queue",
      url: "#",
      icon: ListOrdered,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Gateway",
      url: "#",
      icon: Server,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
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
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <ProjectSwitcher projects={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="gap-3">
          <SidebarGroupLabel>Components</SidebarGroupLabel>
          {toolboxItems.map((item) => (
            <Card
              key={item.type}
              className="cursor-grab active:cursor-grabbing hover:border-primary transition-colors p-1"
              draggable
              onDragStart={(e) => onDragStart(e, item.type)}
            >
              <CardContent className="flex items-center gap-3 p-3">
                <item.icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{item.label}</span>
              </CardContent>
            </Card>
          ))}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
})
