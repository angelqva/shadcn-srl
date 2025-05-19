"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"
import { signOut, useSession } from "next-auth/react";
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
import { Icon } from "@iconify/react";

export function NavUser() {
  const { isMobile } = useSidebar()
  const { data: session } = useSession();
  const [username] = session?.user.correo.split('@') ?? ["Usuario"];
  const inicial = username.charAt(0)
  const finCorreo = '@reduc.edu.cu'
  //TODO avatar fetch from profile
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {/* TODO avatar image <AvatarImage src={user.avatar} alt={username} /> */}
                <AvatarFallback
                  className="rounded-full uppercase border-2 border-secondary bg-secondary-200/50"
                >{inicial}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{username}</span>
                <span className="truncate text-xs">{finCorreo}</span>
              </div>
              <Icon icon="line-md:menu-unfold-right" className="!size-6 !text-secondary-700" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {/* TODO avatar image <AvatarImage src={user.avatar} alt={username} /> */}
                  <AvatarFallback
                    className="rounded-full uppercase border-2 border-secondary bg-secondary-200/50"
                  >{inicial}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{username}</span>
                  <span className="truncate text-xs">{finCorreo}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="text-secondary font-semibold hover:!bg-secondary-200/50 hover:!text-secondary cursor-pointer">
                <Icon icon="streamline:user-profile-focus-solid" className="w-7 h-7 text-secondary" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem className="text-secondary font-semibold hover:!bg-secondary-200/50 hover:!text-secondary cursor-pointer">
                <Icon icon="ep:message-box" className="w-7 h-7 text-secondary" />
                Ordenes
              </DropdownMenuItem>
              <DropdownMenuItem className="text-secondary font-semibold hover:!bg-secondary-200/50 hover:!text-secondary cursor-pointer">
                <Bell className="w-7 h-7 text-secondary" />
                Notificaciones
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-secondary font-semibold hover:!bg-secondary-200/50 hover:!text-secondary cursor-pointer" onClick={() => signOut({ callbackUrl: "/" })}>
              <LogOut className="w-7 h-7 text-secondary" />
              Salir del Sistema
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
