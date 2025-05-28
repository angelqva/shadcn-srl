"use client";

import {
    FormEvent,
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
import { Respuesta, TipoError } from "@/app/_types/type.response";
import { areaSchema, areaCodigoSchema, areaNombreSchema, areaUbicacionSchema, areaDescripcionSchema } from "@/app/_schemas/schema.areas";
import { useStore as useAreasStore } from "@/app/_store/store.areas";



export function AddUpdate({ closeModal }: { closeModal: () => void }) {
    const { seleccion, create, update } = useAreasStore();
    const [formData, setFormData] = useState({
        codigo: seleccion?.codigo ?? "",
        nombre: seleccion?.nombre ?? "",
        ubicacion: seleccion?.ubicacion ?? "",
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
    const handleCodigoChange = (value: string) => {
        setFormData((formData) => ({ ...formData, codigo: value }));
        validateField({
            key: "codigo",
            schema: areaCodigoSchema,
            data: { codigo: value },
        });
    };
    const handleNombreChange = (value: string) => {
        setFormData((formData) => ({ ...formData, nombre: value }));
        validateField({
            key: "nombre",
            schema: areaNombreSchema,
            data: { nombre: value },
        });
    };
    const handleUbicacionChange = (value: string) => {
        setFormData((formData) => ({ ...formData, ubicacion: value }));
        validateField({
            key: "ubicacion",
            schema: areaUbicacionSchema,
            data: { ubicacion: value },
        });
    };
    const handleDescripcionChange = (value: string) => {
        setFormData((formData) => ({ ...formData, descripcion: value }));
        validateField({
            key: "descripcion",
            schema: areaDescripcionSchema,
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
        const parsed = areaSchema.safeParse(formData);
        if (!parsed.success) {
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
                        errorMessage={() => displayErrors("codigo")}
                        isInvalid={typeof errors["codigo"] !== "undefined"}
                        label="Código"
                        name="codigo"
                        placeholder="Complete este campo"
                        type="text"
                        value={formData.codigo}
                        variant="bordered"
                        onValueChange={handleCodigoChange}
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
                        errorMessage={() => displayErrors("ubicacion")}
                        isInvalid={typeof errors["ubicacion"] !== "undefined"}
                        label="Ubicación"
                        labelPlacement="inside"
                        placeholder=""
                        value={formData.ubicacion}
                        variant="bordered"
                        onValueChange={handleUbicacionChange}
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
    const { seleccion, remove } = useAreasStore();
    const [pending, setPending] = useState(false);
    const deleteIcon = soft ? "solar:trash-bin-minimalistic-broken" : "solar:trash-bin-minimalistic-bold";
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
                <p className="text-danger text-center">Esta área será <strong>marcada como eliminada</strong>, pero se podrá recuperar más adelante si es necesario.</p>
            </>) : (<>
                <p className="text-danger text-center">Esta acción <strong>eliminará el área de forma permanente</strong>. No podrá recuperarse después de esta operación.</p>
            </>)}

            <div className="w-full max-w-md mx-auto flex flex-col gap-4 sm:flex-row mt-4">
                <Button
                    className="w-full font-semibold"
                    color="secondary"
                    variant="faded"
                    size="lg"
                    onPress={() => closeModal()}
                >
                    Cancelar
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
                    Eliminar
                </Button>
            </div>
        </div>
    </div>
}

export function Restore({ closeModal }: { closeModal: () => void }) {
    const { seleccion, update } = useAreasStore();
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
            <p className="text-primary text-center">Esta área será <strong>restaurada</strong> y marcada como <strong>activa</strong></p>

            <div className="w-full max-w-md mx-auto flex flex-col gap-4 sm:flex-row mt-4">
                <Button
                    className="w-full font-semibold"
                    color="secondary"
                    variant="faded"
                    size="lg"
                    onPress={() => closeModal()}
                >
                    Cancelar
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
                    Restaurar
                </Button>
            </div>
        </div>
    </div>
}