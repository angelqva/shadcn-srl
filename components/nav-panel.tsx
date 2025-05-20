"use client"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"


export function NavPanel() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" tooltip="Gestionar" asChild>
          <Link href="/panel" className={cn(
            "!text-lg font-semibold !text-secondary-700",
          )}>
            <Icon
              className="!size-7"
              icon="solar:slider-vertical-bold-duotone"
            />
            <span>Panel del Sistema</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
