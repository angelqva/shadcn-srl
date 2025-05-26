import { Prisma } from "@prisma/client";
import { Respuesta, TipoError, TipoRespuesta } from "../_types/type.response";

export class ServicioErrores {
    static prisma({ error, keys }: { error: unknown; keys: string[] }): Respuesta {
        let toast: string | undefined;
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            const errores: TipoError = {};            
            switch (error.code) {
                case "P2002": {
                    const target = error.meta?.target as string[] | undefined;
                    if (target) {
                        keys.forEach((key) => {
                            if (target.includes(key)) {
                                errores[key] = `El campo ${key}, ya existe.`;
                            }
                        });
                    }
                    toast = "Campos duplicados, verifique";
                    break;
                }

                case "P2025":
                    toast = "No se encuentra el objeto a actualizar";
                    break;

                default:
                    toast = `Error de base de datos: ${error.code}, por favor enviar al administrador`;
                    break;
            }

            return {
                tipo: TipoRespuesta.error,
                errores,
                toast
            };
        }

        if (error instanceof Error) {
            return {
                tipo: TipoRespuesta.error,
                toast: `Error operativo: ${error.message}, envíelo al administrador.`,
            };
        }

        return {
            tipo: TipoRespuesta.error,
            toast: "Error de conexión.",
        };
    }
}