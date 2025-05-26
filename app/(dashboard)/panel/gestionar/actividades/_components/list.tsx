"use client"
import React from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    DropdownTrigger,
    Chip,
    Input,
    Button,
    Pagination,
    Spinner,
    useDisclosure,
    Modal,
    ModalContent,
    ModalBody,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useStore as useActividadesStore } from "@/app/_store/store.actividades";
import { Actividad } from "@prisma/client";
import { DateTime } from "luxon";
import { isValidDateString } from "@/lib/utils";
import { Headings } from "@/components/headings";
import { AddUpdate, Remove, Restore } from "./form";

const columnas = [
    { name: "Icono/Nombre/Descripción", uid: "nombre", sortable: true },
    { name: "Persistencia", uid: "persistencia", sortable: true },
    { name: "Creado", uid: "creadoEn" },
    { name: "Actualizado", uid: "actualizadoEn" },
    { name: "Acciones", uid: "acciones" },
];

const columnasVisiblesIniciales = ["nombre", "persistencia", "creadoEn", "actualizadoEn", "acciones"];

const persistenciaTexto = (actividad: Actividad) => (actividad.eliminadoEn ? "Eliminado" : "Activo");
const persistenciaColor = (actividad: Actividad) => (actividad.eliminadoEn ? "danger" : "secondary");
const persistenciaIcon = (actividad: Actividad) => (actividad.eliminadoEn ? "solar:trash-bin-minimalistic-bold" : "solar:check-circle-bold");
const Lista = () => {
    const { listado, loading, setSeleccion, seleccion } = useActividadesStore();
    const { isOpen: isOpenVer, onOpen: onOpenVer, onClose: onCloseVer } = useDisclosure();
    const { isOpen: isOpenForm, onOpen: onOpenForm, onClose: onCloseForm } = useDisclosure();
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();
    const { isOpen: isOpenRestore, onOpen: onOpenRestore, onClose: onCloseRestore } = useDisclosure();
    const [soft, setSoft] = React.useState(true);
    const [filtroPersistencia, setFiltroPersistencia] = React.useState("todos");
    const [filtro, setFiltro] = React.useState("");
    const [pagina, setPagina] = React.useState(1);
    const [filasPorPagina, setFilasPorPagina] = React.useState(10);
    const [columnasVisibles, setColumnasVisibles] = React.useState<string[]>(columnasVisiblesIniciales);

    const listadoFiltradas = React.useMemo(
        () => {
            let filtered = listado.concat();
            if (filtro.length) {
                filtered = filtered.filter((a) => a.nombre.toLowerCase().includes(filtro.toLowerCase()))
            }

            if (filtroPersistencia === "eliminados") {
                filtered = filtered.filter(f => f.eliminadoEn !== null)
            }
            if (filtroPersistencia === "activos") {
                filtered = filtered.filter(f => f.eliminadoEn == null)
            }

            return filtered;

        },
        [filtro, filtroPersistencia, listado]
    );

    const totalPaginas = Math.ceil(listadoFiltradas.length / filasPorPagina) || 1;

    const items = React.useMemo(() => {
        const inicio = (pagina - 1) * filasPorPagina;
        return listadoFiltradas.slice(inicio, inicio + filasPorPagina);
    }, [pagina, filasPorPagina, listadoFiltradas]);

    const formatFecha = (fechaStr: string | Date) => {
        const dt = typeof fechaStr === "string" ? new Date(fechaStr) : fechaStr;
        return DateTime.fromJSDate(dt)
            .setZone("America/New_York")
            .toFormat("dd/LL/yyyy hh:mm a");
    };

    const renderCelda = (actividad: Actividad, columna: string) => {
        switch (columna) {
            case "nombre":
                return (
                    <div className="flex w-full gap-2">
                        <div className="flex-1 min-w-11 h-11 rounded-md border-2 border-slate flex items-center justify-center">
                            <Icon icon={actividad.icono} className="size-7 text-slate-700" />
                        </div>
                        <div className="w-full">
                            <h3 className="text-slate-700 font-semibold line-clamp-1">{actividad.nombre}</h3>
                            <p className="text-slate-500 text-sm line-clamp-1">
                                {actividad.descripcion}
                            </p>
                        </div>
                    </div>
                );
            case "persistencia":
                return <Chip classNames={{ content: ["capitalize font-semibold"] }} startContent={<Icon icon={persistenciaIcon(actividad)} className="size-5" />} color={persistenciaColor(actividad)} size="sm" variant="flat">
                    {persistenciaTexto(actividad)}
                </Chip>;
            case "creadoEn":
                return (
                    <div className="flex items-center w-full gap-1">
                        <Icon icon="hugeicons:database-export" className="size-5 text-slate-700" />
                        <h3 className="text-slate-700 font-semibold line-clamp-1">{formatFecha(actividad.creadoEn)}</h3>
                    </div>
                );
            case "actualizadoEn":
                return (
                    <div className="flex items-center w-full gap-1">
                        <Icon icon="iconoir:database-backup" className="size-5 text-slate-700" />
                        <h3 className="text-slate-700 font-semibold line-clamp-1">{formatFecha(actividad.actualizadoEn)}</h3>
                    </div>
                );
            case "acciones":
                return (
                    <div className="flex justify-center">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button isIconOnly variant="ghost" color="secondary">
                                    <Icon icon="mingcute:settings-6-line" className="size-7" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Acciones" closeOnSelect={true}>
                                <DropdownItem
                                    className="text-secondary font-semibold"
                                    startContent={
                                        <Icon icon="icon-park-solid:view-grid-detail" className="size-7" />
                                    }
                                    color="secondary"
                                    key="ver" onClick={() => {
                                        setSeleccion(actividad.id);
                                        onOpenVer();
                                    }}>
                                    Visualizar
                                </DropdownItem>
                                <DropdownItem
                                    className="text-primary font-semibold"
                                    color="primary"
                                    startContent={
                                        <Icon icon="hugeicons:pencil-edit-02" className="size-7" />
                                    }
                                    key="editar" onClick={() => {
                                        setSeleccion(actividad.id);
                                        onOpenForm();
                                    }}>
                                    Editar
                                </DropdownItem>
                                {actividad.eliminadoEn ? (
                                    <DropdownItem
                                        key="activo"
                                        className="text-primary font-semibold"
                                        startContent={
                                            <Icon icon="hugeicons:database-restore" className="size-7" />
                                        }
                                        color="primary"
                                        onClick={() => {
                                            setSeleccion(actividad.id);
                                            onOpenRestore();
                                        }}
                                    >
                                        Restaurar como Activo
                                    </DropdownItem>

                                ) : (
                                    <DropdownItem
                                        key="eliminar"
                                        className="text-danger font-semibold"
                                        startContent={
                                            <Icon icon="solar:trash-bin-minimalistic-broken" className="size-7" />
                                        }
                                        color="danger"
                                        onClick={() => {
                                            setSeleccion(actividad.id);
                                            setSoft(true);
                                            onOpenDelete();
                                        }}
                                    >
                                        Marcar como Eliminado
                                    </DropdownItem>
                                )}

                                <DropdownItem
                                    key="eliminar-def"
                                    className="text-danger font-semibold"
                                    startContent={
                                        <Icon icon="solar:trash-bin-minimalistic-bold" className="size-7" />
                                    }
                                    color="danger"
                                    onClick={() => {
                                        setSeleccion(actividad.id);
                                        setSoft(false);
                                        onOpenDelete();
                                    }}
                                >
                                    Eliminar definitivamente
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default: {
                const value = actividad[columna as keyof Actividad];
                if (value instanceof Date || (typeof value === "string" && isValidDateString(value))) {
                    return formatFecha(value);
                }
                return (value as React.ReactNode) ?? "-";
            }
        }
    };

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-4">
                <div className="flex flex-col-reverse sm:flex-row gap-4 flex-1">
                    <Button className="w-full sm:max-w-fit font-semibold"
                        onPress={() => {
                            setSeleccion(undefined);
                            onOpenForm();
                        }}
                        startContent={<Icon icon="ci:add-plus" className="size-7" />} variant="bordered" color="secondary">
                        Nueva Actividad
                    </Button>
                    <Input
                        className="w-full sm:max-w-1/2"
                        placeholder="Buscar por nombre..."
                        value={filtro}
                        variant="bordered"
                        color="secondary"
                        onValueChange={setFiltro}
                        startContent={<Icon icon="solar:magnifer-linear" />}
                    />
                </div>

                <div className="flex flex-wrap md:flex-nowrap items-center gap-4">
                    <Dropdown>
                        <DropdownTrigger>
                            <Button className="w-full sm:max-w-fit font-semibold" endContent={<Icon icon="solar:alt-arrow-down-bold-duotone" className="size-7" />} variant="flat" color="secondary">
                                Persistencia
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Persistencia Visible"
                            closeOnSelect={true}
                            disallowEmptySelection
                            selectionMode="single"
                            selectedKeys={new Set([`filtro-persist-${filtroPersistencia}`])}
                            onSelectionChange={(keys) => {
                                const [keySelected] = Array.from(keys as Set<string>)
                                const [_, selected] = keySelected.split("filtro-persist-");
                                setFiltroPersistencia(selected);
                                setPagina(1);
                            }}
                        >
                            {["todos", "eliminados", "activos"].map((col) => (
                                <DropdownItem key={`filtro-persist-${col}`} color="secondary" className="capitalize">
                                    Mostar {col}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>
                    <Dropdown>
                        <DropdownTrigger>
                            <Button className="w-full sm:max-w-fit font-semibold" endContent={<Icon icon="solar:alt-arrow-down-bold-duotone" className="size-7" />} variant="flat" color="secondary">
                                Columnas
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Columnas visibles"
                            closeOnSelect={false}
                            disallowEmptySelection
                            selectionMode="multiple"
                            selectedKeys={new Set(columnasVisibles)}
                            onSelectionChange={(keys) => setColumnasVisibles(Array.from(keys as Set<string>))}
                        >
                            {columnas.map((col) => (
                                <DropdownItem key={col.uid} className="capitalize" color="secondary">
                                    {col.name}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>
                    <Dropdown>
                        <DropdownTrigger>
                            <Button className="w-full sm:max-w-fit font-semibold" endContent={<Icon icon="solar:alt-arrow-down-bold-duotone" className="size-7" />} variant="flat" color="secondary">
                                {filasPorPagina} Filas por Página
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Filas por Página"
                            closeOnSelect={true}
                            disallowEmptySelection
                            selectionMode="single"
                            selectedKeys={new Set([`filas-${filasPorPagina}`])}
                            onSelectionChange={(keys) => {
                                const [keySelected] = Array.from(keys as Set<string>)
                                const [_, selected] = keySelected.split("filas-");
                                setFilasPorPagina(Number(selected));
                                setPagina(1);
                            }}
                        >
                            {[10, 25, 50].map((col) => (
                                <DropdownItem key={`filas-${col}`} color="secondary">
                                    {col} filas por página
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-[300px]">
                    <Spinner label="Cargando actividades..." />
                </div>
            ) : (
                <>
                    <Table
                        aria-label="Tabla de actividades"
                        classNames={{
                            th: ["bg-secondary-100", "font-semibold", "text-secondary-700", "uppercase"],
                            td: ["text-slate-700 font-semibold"]
                        }}
                    >
                        <TableHeader columns={columnas.filter(c => columnasVisibles.includes(c.uid))} className="!bg-secondary-200">
                            {(col) => <TableColumn key={col.uid}>{col.name}</TableColumn>}
                        </TableHeader>
                        <TableBody emptyContent="No se encontraron actividades" items={items}>
                            {(item) => (
                                <TableRow key={item.id}>
                                    {(key) => <TableCell>{renderCelda(item, key.toString())}</TableCell>}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <div className="flex justify-between items-center py-2 px-2 mt-4">
                        <span className="text-sm text-default-400">
                            Mostrando {items.length} de {listadoFiltradas.length} actividades
                        </span>
                        <Pagination
                            isCompact
                            showControls
                            showShadow
                            color="secondary"
                            page={pagina}
                            total={totalPaginas}
                            onChange={setPagina}
                        />
                    </div>
                    <Modal
                        backdrop="blur" placement="center" isOpen={isOpenVer} size="2xl" onClose={onCloseVer} hideCloseButton={true}
                        onOpenChange={(isOpen) => !isOpen && setSeleccion(undefined)}
                    >
                        <ModalContent>
                            {(onCloseVer) => (
                                <>
                                    <ModalBody>
                                        <Headings
                                            action={
                                                <Button
                                                    size="lg"
                                                    className="w-full md:w-fit px-6 py-8 font-semibold text-lg"
                                                    color="secondary"
                                                    variant="solid"
                                                    startContent={
                                                        <Icon icon="solar:multiple-forward-left-bold" className="size-8" />
                                                    }
                                                    onPress={() => onCloseVer()}
                                                >
                                                    Actividades
                                                </Button>
                                            }
                                        >
                                            <h1 className="text-3xl font-bold mb-2 text-secondary-800 flex items-center">
                                                <Icon
                                                    className="w-12 h-12 mr-2"
                                                    icon="icon-park-solid:view-grid-detail"
                                                />
                                                Vista de la Actividad
                                            </h1>
                                            <p className="text-lg">
                                                Revise sus detalles y características.
                                            </p>
                                        </Headings>
                                        <div className="w-full space-y-2 -translate-y-6">
                                            <p>
                                                <Icon
                                                    className="w-8 h-8 mr-2 -mt-1 inline-flex"
                                                    icon="solar:hashtag-broken"
                                                />
                                                <b>ID: </b>
                                                {seleccion?.id}
                                            </p>
                                            <p>
                                                <Icon
                                                    className="w-8 h-8 mr-2 -mt-1 inline-flex"
                                                    icon="solar:info-square-broken"
                                                />
                                                <b>ICONO: </b>
                                                {seleccion?.icono}
                                            </p>
                                            <p>
                                                <Icon
                                                    className="w-8 h-8 mr-2 -mt-1 inline-flex"
                                                    icon="solar:text-field-focus-broken"
                                                />
                                                <b>NOMBRE: </b>
                                                {seleccion?.nombre}
                                            </p>
                                            <p>
                                                <Icon
                                                    className="w-8 h-8 mr-2 -mt-1 inline-flex"
                                                    icon="solar:text-field-focus-broken"
                                                />
                                                <b>DESCRIPCIÓN: </b>
                                                {seleccion?.descripcion}
                                            </p>
                                            <p>
                                                <Icon
                                                    className="w-8 h-8 mr-2 -mt-1 inline-flex"
                                                    icon="hugeicons:database-export"
                                                />
                                                <b>CREADO: </b>
                                                {formatFecha(seleccion?.creadoEn ?? "")}
                                            </p>
                                            <p>
                                                <Icon
                                                    className="w-8 h-8 mr-2 -mt-1 inline-flex"
                                                    icon="iconoir:database-backup"
                                                />
                                                <b>ACTUALIZADO: </b>
                                                {formatFecha(seleccion?.actualizadoEn ?? "")}
                                            </p>
                                            {seleccion?.eliminadoEn && <p>
                                                <Icon
                                                    className="w-8 h-8 mr-2 -mt-1 inline-flex"
                                                    icon="hugeicons:database-import"
                                                />
                                                <b>ELIMINADO: </b>
                                                {formatFecha(seleccion?.eliminadoEn ?? "")}
                                            </p>}
                                        </div>
                                    </ModalBody>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                    <Modal
                        backdrop="blur" placement="center" isOpen={isOpenForm} size="2xl" onClose={onCloseForm} hideCloseButton={true}
                        onOpenChange={(isOpen) => !isOpen && setSeleccion(undefined)}
                    >
                        <ModalContent>
                            {(onCloseForm) => (
                                <>
                                    <ModalBody>
                                        <Headings
                                            action={
                                                <Button
                                                    size="lg"
                                                    className="w-full md:w-fit px-6 py-8 font-semibold text-lg"
                                                    color="secondary"
                                                    variant="solid"
                                                    startContent={
                                                        <Icon icon="solar:multiple-forward-left-bold" className="size-8" />
                                                    }
                                                    onPress={() => onCloseForm()}
                                                >
                                                    Actividades
                                                </Button>
                                            }
                                        >
                                            <h1 className="text-3xl font-bold mb-2 text-secondary-800 flex items-center">
                                                <Icon
                                                    className="w-12 h-12 mr-2"
                                                    icon={`${seleccion ? 'hugeicons:pencil-edit-02' : 'ci:add-plus'}`}
                                                />
                                                {seleccion ? <span>Editar Actividad <span className="text-nowrap">
                                                    <Icon
                                                        className="w-8 h-8 mr-2 -mt-1 inline-flex"
                                                        icon="solar:hashtag-broken"
                                                    /> {seleccion.id}
                                                </span></span> : 'Nueva Actividad'}
                                            </h1>
                                            <p className="text-lg">
                                                Rellene los datos necesarios para {seleccion ? 'editar' : 'crear'} la actividad.
                                            </p>
                                        </Headings>
                                        <div className="w-full space-y-2 -translate-y-6">
                                            <AddUpdate closeModal={onCloseForm} />
                                        </div>
                                    </ModalBody>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                    <Modal
                        backdrop="blur" placement="center" isOpen={isOpenDelete} size="2xl" onClose={onCloseDelete} hideCloseButton={true}
                        onOpenChange={(isOpen) => !isOpen && setSeleccion(undefined)}
                    >
                        <ModalContent>
                            {(onCloseDelete) => (
                                <>
                                    <ModalBody>
                                        <Headings
                                            action={
                                                <Button
                                                    size="lg"
                                                    className="w-full md:w-fit px-6 py-8 font-semibold text-lg"
                                                    color="secondary"
                                                    variant="solid"
                                                    startContent={
                                                        <Icon icon="solar:multiple-forward-left-bold" className="size-8" />
                                                    }
                                                    onPress={() => onCloseDelete()}
                                                >
                                                    Actividades
                                                </Button>
                                            }
                                        >
                                            <h1 className="text-3xl font-bold mb-2 text-secondary-800 flex items-center">
                                                <Icon
                                                    className="w-12 h-12 mr-2"
                                                    icon={`${soft ? "solar:trash-bin-minimalistic-bold" : "solar:check-circle-bold"}`}
                                                />
                                                {seleccion && <span>Eliminar Actividad <span className="text-nowrap">
                                                    <Icon
                                                        className="w-8 h-8 mr-2 -mt-1 inline-flex"
                                                        icon="solar:hashtag-broken"
                                                    /> {seleccion.id}
                                                </span></span>}
                                            </h1>
                                            <p className="text-lg">
                                                ¿Está seguro que desea realizar la operación?
                                            </p>
                                        </Headings>
                                        <div className="w-full space-y-2 -translate-y-6">
                                            <Remove closeModal={onCloseDelete} soft={soft} />
                                        </div>
                                    </ModalBody>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                    <Modal
                        backdrop="blur" placement="center" isOpen={isOpenRestore} size="2xl" onClose={onCloseRestore} hideCloseButton={true}
                        onOpenChange={(isOpen) => !isOpen && setSeleccion(undefined)}
                    >
                        <ModalContent>
                            {(onCloseRestore) => (
                                <>
                                    <ModalBody>
                                        <Headings
                                            action={
                                                <Button
                                                    size="lg"
                                                    className="w-full md:w-fit px-6 py-8 font-semibold text-lg"
                                                    color="secondary"
                                                    variant="solid"
                                                    startContent={
                                                        <Icon icon="solar:multiple-forward-left-bold" className="size-8" />
                                                    }
                                                    onPress={() => onCloseRestore()}
                                                >
                                                    Actividades
                                                </Button>
                                            }
                                        >
                                            <h1 className="text-3xl font-bold mb-2 text-secondary-800 flex items-center">
                                                <Icon
                                                    className="w-12 h-12 mr-2"
                                                    icon="hugeicons:database-restore"
                                                />
                                                {seleccion && <span>Restaurar Actividad <span className="text-nowrap">
                                                    <Icon
                                                        className="w-8 h-8 mr-2 -mt-1 inline-flex"
                                                        icon="solar:hashtag-broken"
                                                    /> {seleccion.id}
                                                </span></span>}
                                            </h1>
                                            <p className="text-lg">
                                                ¿Está seguro que desea realizar la operación?
                                            </p>
                                        </Headings>
                                        <div className="w-full space-y-2 -translate-y-6">
                                            <Restore closeModal={onCloseRestore} />
                                        </div>
                                    </ModalBody>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </>
            )}
        </div>
    );
};

export default Lista;
