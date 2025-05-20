"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Icon } from "@iconify/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const links = [
  {
    nombre: "Actividades",
    href: "/panel/gestionar/actividades",
    icon: "solar:tag-horizontal-bold-duotone",
  },
  {
    nombre: "Áreas",
    href: "/panel/gestionar/areas",
    icon: "solar:streets-map-point-bold-duotone",
  },
  {
    nombre: "Locales",
    href: "/panel/gestionar/locales",
    icon: "solar:exit-bold-duotone",
  },
  {
    nombre: "Medios",
    href: "/panel/gestionar/medios",
    icon: "solar:devices-bold-duotone",
  },
  {
    nombre: "Usuarios",
    href: "/panel/gestionar/usuarios",
    icon: "solar:users-group-rounded-bold-duotone",
  },
]

export function NavMain() {
  const pathname = usePathname();
  const setActiveClass = (path: string) => ({
    className: cn(
      pathname.startsWith(path) && "!bg-sidebar-accent !text-sidebar-accent-foreground !font-semibold"
    )
  })
  return (
    <SidebarGroup>
      <SidebarMenu>
        <Collapsible
          asChild
          defaultOpen={pathname.startsWith("/panel/gestionar")}
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip="Gestionar" asChild>
                <Link href="/panel/gestionar" {...setActiveClass("/panel/gestionar")}>
                  <Icon
                    className="!size-5"
                    icon="solar:widget-add-bold-duotone"
                  />
                  <span>Gestionar</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </Link>
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {links.map(({ nombre, href, icon }) => (
                  <SidebarMenuSubItem key={'gestionar-' + nombre}>
                    <SidebarMenuSubButton asChild>
                      <Link href={href} {...setActiveClass(href)}>
                        <Icon icon={icon} className="!size-5" />
                        <span>{nombre}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}                
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  )
}
