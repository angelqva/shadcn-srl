import { BtnLink } from "@/components/btn-link"
import { CardLinks } from "@/components/card-links"
import { Headings } from "@/components/headings"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Icon } from "@iconify/react";



export default function Page() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 bg-fuchsia-700/5 backdrop-blur-lg border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/panel">
                  Panel
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Gestionar</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col px-4 md:px-6">
        <div className="w-full">
          <Headings
            action={
              <BtnLink
                href="/panel"
                icon={
                  <Icon
                    className="w-12 h-12 text-white"
                    icon="solar:multiple-forward-left-bold"
                  />
                }
              >
                Panel del Sistema
              </BtnLink>
            }
          >
            <h1 className="text-3xl font-bold mb-2 text-secondary-800">
              Gestión del Sistema de Reservaciones
            </h1>
            <p className="text-lg">
              Administra las áreas de la universidad, locales y otras
              configuraciones necesarias.
            </p>
          </Headings>
          <CardLinks
            items={[
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
            ]}
          />
        </div>

      </div>
    </>
  )
}