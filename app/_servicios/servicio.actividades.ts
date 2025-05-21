"use server";
import { revalidatePath } from "next/cache";
import { TipoEvento } from "@prisma/client";
import { cookies } from "next/headers";

import { handleErrors } from "@/lib/utils";
import { DbActividades } from "../_db/db.actividades";

export async function saveActividad(
    prevState: {
        id?: number;
        fields?: Record<string, string>;
        errors?: Record<string, string | string[]>;
        type?: "success" | "error";
        actividad?: TipoEvento;
    },
    formData: FormData,
) {
    const newState = { ...prevState };

    newState.fields = Object.fromEntries(formData.entries()) as Record<
        string,
        string
    >;

    if (newState.id) {
        try {
            const actividad = await DbActividades.update(
                newState.id,
                formData,
            );

            newState.type = "success";
            newState.errors = {} as Record<string, string | string[]>;

            if (actividad.id !== newState.id) {
                revalidatePath(`/panel/gestionar/actividades`);
                const cookieStore = await cookies();

                cookieStore.set(
                    "feedback",
                    JSON.stringify({
                        type: "success",
                        message: `Actividad: ${actividad.nombre} actualizada.`,
                    }),
                );
            } else {
                revalidatePath(
                    `/panel/gestionar/actividades`,
                );
            }
            newState.actividad = actividad;
        } catch (error) {
            newState.type = "error";
            console.log({ error });
            newState.errors = handleErrors(error);
        }
    } else {
        try {
            await DbActividades.create(formData);

            newState.type = "success";
            newState.errors = {} as Record<string, string | string[]>;
            revalidatePath(`/panel/gestionar/actividades`);
        } catch (error) {
            newState.type = "error";
            newState.errors = handleErrors(error);
        }
    }

    return newState;
}
export async function deleteActividad(
    prevState: { toast?: string },
    formData: FormData,
) {
    const newState = { ...prevState };

    try {
        const id = formData.get("id")?.toString() ?? null;

        if (!id) return { toast: "Provea un slug para eliminar" };
        const actividad = await DbActividades.softDelete(Number(id));
        const cookieStore = await cookies();

        cookieStore.set(
            "feedback",
            JSON.stringify({
                type: "success",
                message: `Actividad: ${actividad.nombre} eliminada.`,
            }),
        );
        newState.toast = undefined;
    } catch (error) {
        newState.toast = "Compruebe si existe o revise su conexión";
    }

    return newState;
}