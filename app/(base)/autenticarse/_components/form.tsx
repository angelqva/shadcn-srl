"use client";
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Icon } from "@iconify/react";
import { Form, Input, Button, addToast } from "@heroui/react"
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";

export function FormAutenticarse({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [isVisible, setIsVisible] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [errors, setErrors] = useState<Record<string, string | string[]>>({});
    const router = useRouter();

    const toggleVisibility = () => setIsVisible(!isVisible);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSending(true);
        const data = Object.fromEntries(new FormData(event.currentTarget));
        const res = await signIn("credentials", {
            usuario: (data.usuario as string) ?? "",
            contraseña: (data.contraseña as string) ?? "",
            redirect: false,
        });

        setIsSending(false);
        if (!res?.error) {
            addToast({
                title: "Notificación de Éxito",
                description: "Ha autenticado de forma satisfactoria",
                color: "success",
            });
            router.push("/panel"); // Redirigir después del login exitoso
        } else {
            if (res.error) {
                const responseErrors = JSON.parse(res.error) as Record<
                    string,
                    string[] | string
                >;

                if (responseErrors.usuario || responseErrors.contraseña) {
                    setErrors({
                        usuario: responseErrors.usuario,
                        contraseña: responseErrors.contraseña,
                    });
                    addToast({
                        title: "Notificación de Error",
                        description: "Verifique los campos con error",
                        color: "danger",
                    });
                }
                if (responseErrors.toast) {
                    addToast({
                        title: "Notificación de Error",
                        description:
                            typeof responseErrors.toast === "string"
                                ? responseErrors.toast
                                : responseErrors.toast.join(", "),
                        color: "danger",
                    });
                }
            }
        }
    };
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <div className="p-6 md:p-8">
                        <div className="flex flex-col items-center pb-6">
                            <Icon
                                className="w-16 h-16 text-secondary-600"
                                icon="solar:shield-keyhole-bold"
                            />
                            <p className="text-2xl font-semibold text-secondary-800">
                                Autenticarse
                            </p>
                            <p>Introduce los datos para continuar</p>
                        </div>
                        <Form
                            className="flex flex-col gap-3"
                            validationBehavior="native"
                            validationErrors={errors}
                            onSubmit={handleSubmit}
                        >
                            <Input
                                isRequired
                                autoComplete="username"
                                label="Usuario"
                                name="usuario"
                                placeholder="Introduzca su usuario"
                                type="text"
                                validate={(value) => {
                                    if (!value) {
                                        return "El usuario es obligatorio";
                                    }
                                    if (value.length < 3) {
                                        return "El nombre de usuario debe tener al menos 3 caracteres";
                                    }

                                    if (value.length > 20) {
                                        return "El nombre de usuario no puede tener más de 20 caracteres";
                                    }

                                    if (!/^[a-zA-Z0-9\.]+$/.test(value)) {
                                        return "El nombre de usuario solo puede contener letras, números y punto";
                                    }

                                    if (/^\d+$/.test(value)) {
                                        return "El nombre de usuario no puede contener solo números";
                                    }

                                    return null; // No hay errores
                                }}
                                variant="bordered"
                            />
                            <Input
                                isRequired
                                autoComplete="current-password"
                                endContent={
                                    <button type="button" onClick={toggleVisibility}>
                                        {isVisible ? (
                                            <Icon
                                                className="text-2xl pointer-events-none text-default-400"
                                                icon="solar:eye-closed-linear"
                                            />
                                        ) : (
                                            <Icon
                                                className="text-2xl pointer-events-none text-default-400"
                                                icon="solar:eye-bold"
                                            />
                                        )}
                                    </button>
                                }
                                label="Contraseña"
                                name="contraseña"
                                placeholder="Introduzca su contraseña"
                                type={isVisible ? "text" : "password"}
                                validate={(value) => {
                                    if (!value) {
                                        return "La contraseña es obligatoria";
                                    }

                                    if (value.length < 7) {
                                        return "La contraseña debe tener al menos 7 caracteres";
                                    }

                                    return null; // No hay errores
                                }}
                                variant="bordered"
                            />

                            <Button
                                className="w-full font-semibold"
                                color="secondary"
                                isLoading={isSending}
                                size="lg"
                                startContent={
                                    !isSending && (
                                        <Icon
                                            className="w-7 h-7"
                                            icon="solar:shield-keyhole-broken"
                                        />
                                    )
                                }
                                type="submit"
                            >
                                Autenticarse
                            </Button>
                        </Form>
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
