"use client";

import {
    FormEvent,
    useEffect,
    useState,
} from "react";
import {
    Button,
    Input,
    Form,
    Textarea,
    addToast,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { ZodObject } from "zod";
import { actividadNombreSchema, actividadDescripcionSchema, actividadIconoSchema, actividadSchema }
    from "@/app/_schemas/schema.actividades";
import { useStore as useActividadesStore } from "@/app/_store/store.actividades";
import { Respuesta, TipoError } from "@/app/_types/type.response";



export function AddUpdate({ closeModal }: { closeModal: () => void }) {
    const { seleccion, create, update } = useActividadesStore();
    const [formData, setFormData] = useState({
        icono: seleccion?.icono ?? "",
        nombre: seleccion?.nombre ?? "",
        descripcion: seleccion?.descripcion ?? ""
    })
    const [pending, setPending] = useState(false);
    const [errors, setErrors] = useState<Record<string, string | string[]>>({});
    const validateField = ({
        key,
        schema,
        data,
    }: {
        key: string;
        schema: ZodObject<any>;
        data: Record<string, unknown>;
    }) => {
        const { [key]: _, ...restErrors } = errors;
        const parsed = schema.safeParse(data);
        let fieldErrors: TipoError = {};

        if (!parsed.success) {
            fieldErrors = parsed.error.formErrors.fieldErrors;
        }
        setErrors({
            ...restErrors,
            ...fieldErrors as Record<string, string | string[]>,
        });
    };
    const displayErrors = (key: string) => {
        const fieldError = errors[key];

        if (typeof fieldError === "string") {
            return (
                <ul>
                    <li>{fieldError}</li>
                </ul>
            );
        } else if (Array.isArray(fieldError)) {
            return (
                <ul>
                    {fieldError.map((err, i) => (
                        <li key={`error-nombre-${i}`}>{err}</li>
                    ))}
                </ul>
            );
        }

        return "";
    };
    const handleIconoChange = (value: string) => {
        setFormData((formData) => ({ ...formData, icono: value }));
        validateField({
            key: "icono",
            schema: actividadIconoSchema,
            data: { icono: value },
        });
    };
    const handleNombreChange = (value: string) => {
        setFormData((formData) => ({ ...formData, nombre: value }));
        validateField({
            key: "nombre",
            schema: actividadNombreSchema,
            data: { nombre: value },
        });
    };
    const handleDescripcionChange = (value: string) => {
        setFormData((formData) => ({ ...formData, descripcion: value }));
        validateField({
            key: "descripcion",
            schema: actividadDescripcionSchema,
            data: { descripcion: value },
        });
    };
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setPending(true);
        const datos = new FormData();
        Object.entries(formData).forEach(
            ([key, value]) => {
                console.log({ key, value });
                datos.append(key, value);
            },
        );
        console.log(formData);
        const parsed = actividadSchema.safeParse(formData);
        if (!parsed.success) {
            console.log(Array.from(datos.entries()));
            console.log('errors here')
            setErrors(parsed.error.formErrors.fieldErrors as Record<string, string | string[]>)
        }

        else {
            let response: Respuesta | undefined;
            if (seleccion) {
                response = await update(seleccion.id, datos);
            } else {
                response = await create(datos);
            }
            if (response) {
                if (response.errores) {
                    setErrors({ ...response.errores as Record<string, string | string[]> })
                }
                if (response.toast) {
                    addToast({
                        title: response.tipo === "danger" ? "Falló la operación" : "Operación Correcta",
                        description: response.toast,
                        color: response.tipo,
                    });
                }
                if (response.tipo === "success") {
                    closeModal();
                }
                setPending(false);
            }
        }

    };
    return (
        <div className="flex items-center justify-center w-full h-full">
            <div className="w-full max-w-md mx-auto">
                <Form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-3"
                    validationBehavior="aria"
                    validationErrors={errors}
                >
                    <Input
                        isRequired
                        autoComplete="off"
                        errorMessage={() => displayErrors("icono")}
                        isInvalid={typeof errors["icono"] !== "undefined"}
                        label="Icono"
                        name="icono"
                        placeholder="Complete este campo"
                        type="text"
                        value={formData.icono}
                        variant="bordered"
                        onValueChange={handleIconoChange}
                    />
                    <Input
                        isRequired
                        autoComplete="off"
                        errorMessage={() => displayErrors("nombre")}
                        isInvalid={typeof errors["nombre"] !== "undefined"}
                        label="Nombre"
                        name="nombre"
                        placeholder="Complete este campo"
                        type="text"
                        value={formData.nombre}
                        variant="bordered"
                        onValueChange={handleNombreChange}
                    />
                    <Textarea
                        autoComplete="off"
                        errorMessage={() => displayErrors("descripcion")}
                        isInvalid={typeof errors["descripcion"] !== "undefined"}
                        label="Descripcion"
                        labelPlacement="inside"
                        placeholder=""
                        value={formData.descripcion}
                        variant="bordered"
                        onValueChange={handleDescripcionChange}
                    />
                    <Button
                        className="w-full font-semibold"
                        color="secondary"
                        isLoading={pending}
                        size="lg"
                        startContent={
                            !pending && (
                                <Icon className="w-7 h-7" icon="solar:database-broken" />
                            )
                        }
                        type="submit"
                    >
                        Guardar
                    </Button>
                </Form>
            </div>
        </div>
    );
}

export function Remove({ closeModal, soft = false }: { closeModal: () => void, soft?: boolean }) {
    const { seleccion, remove } = useActividadesStore();
    const [pending, setPending] = useState(false);
    const deleteIcon = soft ? "solar:trash-bin-minimalistic-bold" : "solar:check-circle-bold";
    const handleDelete = async () => {
        setPending(true);
        if (seleccion) {
            const response = await remove(seleccion.id, soft);
            if (response.toast) {
                addToast({
                    title: response.tipo === "danger" ? "Falló la operación" : "Operación Correcta",
                    description: response.toast,
                    color: response.tipo,
                });
            }
            closeModal();
        }
        setPending(false);

    }
    return <div className="flex items-center justify-center w-full h-full">
        <div className="w-full max-w-xl mx-auto">
            {soft ? (<>
                <p className="text-danger text-center">Esta actividad será <strong>marcada como eliminada</strong>, pero se podrá recuperar más adelante si es necesario.</p>
            </>) : (<>
                <p className="text-danger text-center">Esta acción <strong>eliminará la actividad de forma permanente</strong>. No podrá recuperarse después de esta operación.</p>
            </>)}

            <div className="w-full max-w-md mx-auto flex flex-col gap-4 sm:flex-row mt-4">
                <Button
                    className="w-full font-semibold"
                    color="secondary"
                    variant="faded"
                    size="lg"
                    onPress={() => closeModal()}
                >
                    Cancelar la operación
                </Button>
                <Button
                    className="w-full font-semibold sm:flex-grow"
                    color="danger"
                    isLoading={pending}
                    size="lg"
                    startContent={
                        !pending && (
                            <Icon className="w-7 h-7" icon={deleteIcon} />
                        )
                    }
                    onPress={() => handleDelete()}
                >
                    {soft ? "Marcar como eliminada" : "Eliminar definitivamente"}
                </Button>
            </div>
        </div>
    </div>
}

export function Restore({ closeModal }: { closeModal: () => void }) {
    const { seleccion, update } = useActividadesStore();
    const [pending, setPending] = useState(false);
    const handleRestore = async () => {
        setPending(true);
        if (seleccion) {
            const formData = new FormData();
            formData.append("eliminadoEn", "null");
            const response = await update(seleccion.id, formData)
            if (response.toast) {
                addToast({
                    title: response.tipo === "danger" ? "Falló la operación" : "Operación Correcta",
                    description: response.toast,
                    color: response.tipo,
                });
            }
            closeModal();
        }
        setPending(false);

    }
    return <div className="flex items-center justify-center w-full h-full">
        <div className="w-full max-w-xl mx-auto">
            <p className="text-primary text-center">Esta actividad será <strong>restaurada</strong> y marcada como <strong>activa</strong></p>

            <div className="w-full max-w-md mx-auto flex flex-col gap-4 sm:flex-row mt-4">
                <Button
                    className="w-full font-semibold"
                    color="secondary"
                    variant="faded"
                    size="lg"
                    onPress={() => closeModal()}
                >
                    Cancelar la operación
                </Button>
                <Button
                    className="w-full font-semibold sm:flex-grow"
                    color="primary"
                    isLoading={pending}
                    size="lg"
                    startContent={
                        !pending && (
                            <Icon className="w-7 h-7" icon="hugeicons:database-restore" />
                        )
                    }
                    onPress={() => handleRestore()}
                >
                    Activar Actividad
                </Button>
            </div>
        </div>
    </div>
}