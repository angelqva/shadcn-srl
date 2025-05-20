import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <SidebarProvider>
        <AppSidebar className="bg-fuchsia-700/5 backdrop-blur-lg " />
        <SidebarInset className="bg-transparent">
            {children}
        </SidebarInset>
    </SidebarProvider>
}