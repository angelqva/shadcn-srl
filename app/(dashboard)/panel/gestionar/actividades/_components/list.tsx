"use client";
import { Icon } from "@iconify/react";
import { Actividad } from "@prisma/client";
import { useMemo, useState } from "react";
import { Input, Card, CardBody, CardHeader } from "@heroui/react";

import { BtnLink } from "@/components/btn-link";

export default function ListadoActividades({
    actividades,
}: {
    actividades: Actividad[];
}) {
    const [filter, setFilter] = useState("");

    const actividadesFiltradas = useMemo(() => {
        const query = filter.trim().toLowerCase();

        if (query.length === 0) return actividades;

        return actividades.filter(
            (actividad) =>
                actividad.nombre.toLowerCase().includes(query) ||
                actividad.icono.toLowerCase().includes(query) ||
                actividad.descripcion?.toLocaleLowerCase().includes(query)
    );
    }, [filter, actividades]);

    return (
        <section className="space-y-10">
            <div className="flex flex-col sm:flex-row gap-5 items-center">
                <BtnLink
                    className="w-full sm:w-fit text-lg font-semibold py-6 px-4"
                    href={`/panel/gestionar/actividades/crear`}
                    icon={
                        <Icon
                            className="w-7 h-7 min-w-7 text-white"
                            icon="solar:add-square-bold"
                        />
                    }
                >
                    Agregar
                </BtnLink>
                <Input
                    color="secondary"
                    placeholder="Filtrar por nombre, icono ..."
                    size="lg"
                    startContent={
                        <Icon
                            className="w-8 h-8 min-w-8 text-secondary-600"
                            icon="solar:filter-bold-duotone"
                        />
                    }
                    value={filter}
                    variant="bordered"
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>

            {actividades.length === 0 ? (
                <p className="">No hay actividades registradas aún.</p>
            ) : actividadesFiltradas.length === 0 ? (
                <p className="">No se encontraron actividades con ese criterio.</p>
            ) : (
                <div className="flex flex-wrap gap-5">
                    {actividadesFiltradas.map((actividad) => (
                        <Card
                            key={actividad.id}
                            className="w-full md:max-w-xs hover:shadow-lg bg-secondary-200/15"
                        >
                            <CardHeader className="flex justify-between min-h-20">
                                <div className="flex items-center">
                                    <Icon
                                        className="w-12 h-12 min-w-12 text-secondary-600"
                                        icon={actividad.icono}
                                    />
                                    <h3 className="text-xl font-semibold pl-2 text-secondary-800 line-clamp-2">
                                        {actividad.nombre}
                                    </h3>
                                </div>
                            </CardHeader>
                            <CardBody className="space-y-4 text-secondary-800">
                                <BtnLink
                                    className="w-full text-lg font-semibold"
                                    href={`/panel/gestionar/actividades/${actividad.id}`}
                                    icon={
                                        <Icon
                                            className="w-7 h-7 text-white"
                                            icon="solar:plate-bold"
                                        />
                                    }
                                >
                                    Detalles
                                </BtnLink>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}
        </section>
    );
}
