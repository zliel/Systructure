import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAuth } from "@/features/auth/contexts/AuthContext"

export function NavUser() {
  const { isMobile } = useSidebar()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  if (!user) {
    return null
  }

  return (
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage alt={user.username} />
                  <AvatarFallback className="rounded-lg">{user.username[0].toLocaleUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.username}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </DropdownMenuItem>
  )
}
