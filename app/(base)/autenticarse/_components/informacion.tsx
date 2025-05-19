"use client";
import { Card, CardContent } from "@/components/ui/card"
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { LayoutDashboard } from "lucide-react";
import LogoutButton from "@/components/logout-btn";

export function Informacion({
    user,
}: {
    user: { correo: string; nombreCompleto: string };
}) {
    const router = useRouter();
    return (
        <div className="flex flex-col gap-6">
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <div className="p-6 md:p-8">
                        <div className="flex flex-col items-center pb-6">
                            <Icon
                                className="w-16 h-16 text-secondary-600"
                                icon="solar:shield-keyhole-bold"
                            />
                            <p className="mb-4 text-2xl font-bold text-secondary-800">
                                ¡Bienvenido!
                            </p>
                            <p className="mb-2 text-xl font-medium text-secondary-800">
                                {user.nombreCompleto}
                            </p>
                            <p className="px-4 mb-4 text-center">
                                Por favor siga el enlace a continuación para acceder al sistema
                            </p>
                            <Button
                                as={Link}
                                className="font-semibold"
                                color="secondary"
                                href="/panel"
                                startContent={<LayoutDashboard />}
                                variant="shadow"
                                size="lg"
                            >
                                Panel de Trabajo
                            </Button>
                            <p className="px-4 my-4 text-center">
                                Si desea salir presione el enlace a continuación
                            </p>
                            <LogoutButton className="font-semibold" size="lg" color="secondary" variant="ghost">
                                Salir del Sistema
                            </LogoutButton>
                        </div>
                    </div>
                    <div className="relative hidden bg-muted md:block">
                        <img
                            src="/images/login.png"
                            alt="Personas atentos a los eventos en el calendario"
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
