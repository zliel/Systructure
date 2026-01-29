import { Outlet } from "react-router-dom"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function EditorLayout() {
  return (
    <SidebarProvider>
      <Outlet />
    </SidebarProvider>
  )
}

