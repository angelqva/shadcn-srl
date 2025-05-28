"use client";

import {
    FormEvent,
    Key,
    useMemo,
    useState,
} from "react";
import {
    Button,
    Input,
    Form,
    Textarea,
    addToast,
    Autocomplete,
    AutocompleteItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { ZodObject } from "zod";
import { Respuesta, TipoError } from "@/app/_types/type.response";
import * as localSchemas from "@/app/_schemas/schema.locales";
import { useStore as useLocalesStore } from "@/app/_store/store.locales";
import { useStore as useAreasStore } from "@/app/_store/store.areas";
import { ReusableEmail } from "@/components/reusable-email";



export function AddUpdate({ closeModal }: { closeModal: () => void }) {
    const { seleccion, create, update } = useLocalesStore();
    const { listado: listadoAreas } = useAreasStore();
    const [formData, setFormData] = useState({
        codigo: seleccion?.codigo ?? "",
        nombre: seleccion?.nombre ?? "",
        ubicacion: seleccion?.ubicacion ?? "",
        descripcion: seleccion?.descripcion ?? "",
        responsables: seleccion?.responsables.split(";") ?? [] as string[],
        areaId: typeof seleccion?.areaId === "number" ? String(seleccion?.areaId) : ""
    })
    const [pending, setPending] = useState(false);
    const [errors, setErrors] = useState<Record<string, string | string[]>>({});
    const areas = useMemo(() => {
        return listadoAreas
            .filter(a => a.eliminadoEn === null)
            .map(a => ({ id: String(a.id), name: a.nombre, codigo: a.codigo }))
    }, [listadoAreas])
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
            schema: localSchemas.localCodigoSchema,
            data: { codigo: value },
        });
    };
    const handleNombreChange = (value: string) => {
        setFormData((formData) => ({ ...formData, nombre: value }));
        validateField({
            key: "nombre",
            schema: localSchemas.localNombreSchema,
            data: { nombre: value },
        });
    };
    const handleUbicacionChange = (value: string) => {
        setFormData((formData) => ({ ...formData, ubicacion: value }));
        validateField({
            key: "ubicacion",
            schema: localSchemas.localUbicacionSchema,
            data: { ubicacion: value },
        });
    };
    const handleDescripcionChange = (value: string) => {
        setFormData((formData) => ({ ...formData, descripcion: value }));
        validateField({
            key: "descripcion",
            schema: localSchemas.localDescripcionSchema,
            data: { descripcion: value },
        });
    };
    const handleResponsableChange = (value: string[]) => {
        setFormData((formData) => ({ ...formData, responsables: value }));
        validateField({
            key: "responsables",
            schema: localSchemas.localResponsablesSchema,
            data: { responsables: value },
        });
    };
    const handleAreaChange = (key: Key | null | undefined) => {
        const keyVal = (key as string) ?? "areaId-";
        const [_, areaVal] = keyVal.split('areaId-');
        setFormData((formData) => ({ ...formData, areaId: areaVal }));
        validateField({
            key: "areaId",
            schema: localSchemas.localAreaSchema,
            data: { areaId: areaVal },
        });
    };
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setPending(true);
        const datos = new FormData();
        console.log({formData});
        Object.entries(formData).forEach(
            ([key, value]) => {
                if (key === "responsables" && Array.isArray(value))
                    datos.append(key, value.join(';'))
                else if (key !== "responsables")
                    datos.append(key, value as string);
            },
        );
        const parsed = localSchemas.localSchema.safeParse(formData);
        if (!parsed.success) {
            setErrors(parsed.error.formErrors.fieldErrors as Record<string, string | string[]>)
        }

        else {
            let response: Respuesta | undefined;
            ;
            if (seleccion) {
                response = await update(seleccion.id, datos);
            } else {
                response = await create(datos);
            }
            if (response) {
                console.log({response})
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
                
            }
        }
        setPending(false);
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
                    <Autocomplete
                        defaultItems={areas}
                        errorMessage={() => displayErrors("areaId")}
                        isInvalid={typeof errors["areaId"] !== "undefined"}
                        label="Área"
                        listboxProps={{
                            emptyContent: "No se encontraron áreas.",
                        }}
                        placeholder="Selecciona un área"
                        selectedKey={formData.areaId.length ? `areaId-${formData.areaId}` : undefined}
                        variant="bordered"
                        onSelectionChange={handleAreaChange}
                        
                    >
                        {(item) => (
                            <AutocompleteItem key={`areaId-${item.id}`} color="secondary" textValue={item.name}>
                                <div className="flex w-full gap-2 items-center">
                                    <div className="flex-1 min-w-11 h-11 rounded-md border-2 border-slate flex items-center justify-center">
                                        <Icon icon="solar:streets-map-point-bold-duotone" className="size-7" />
                                    </div>
                                    <div className="w-full">
                                        <h3 className=" font-semibold line-clamp-1">{item.name}</h3>
                                        <p className=" text-sm line-clamp-1">
                                            {item.codigo}
                                        </p>
                                    </div>
                                </div>
                            </AutocompleteItem>
                        )}
                    </Autocomplete>
                    <ReusableEmail
                        isRequired
                        errorMessage={() => displayErrors("responsables")}
                        label="Responsables:"
                        labelAdd="Agregar correo de Responsable"
                        labelDelete="Eliminar correo del Responsable"
                        labelInput="Correo del Responsable"
                        value={formData.responsables}
                        onValueChange={handleResponsableChange}
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
    const { seleccion, remove } = useLocalesStore();
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
                <p className="text-danger text-center">Este local será <strong>marcado como eliminada</strong>, pero se podrá recuperar más adelante si es necesario.</p>
            </>) : (<>
                <p className="text-danger text-center">Este local será <strong>eliminado de forma permanente</strong>. No podrá recuperarse después de esta operación.</p>
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
                            <Icon className="!size-7" icon={deleteIcon} />
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
    const { seleccion, update } = useLocalesStore();
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
            <p className="text-primary text-center">Este local será <strong>restaurado</strong> y marcado como <strong>activo</strong></p>

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