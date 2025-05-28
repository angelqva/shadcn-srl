import { ServicioPrisma } from "../_servicios/servicio.prisma";
import { Respuesta, TipoRespuesta } from "../_types/type.response";
import { ServicioErrores } from "../_servicios/servicio.errores";
import { localSchema } from "../_schemas/schema.locales";

const prisma = ServicioPrisma.Client();

export class DbLocales {
    static model = prisma.local;
    static async list(): Promise<Respuesta> {
        try {
            const locales = await DbLocales.model.findMany({
                orderBy: { actualizadoEn: "desc" },
                include: {
                    area: true,
                    _count: {
                        select: {
                            medios: true
                        }
                    }
                }
            });
            return {
                tipo: TipoRespuesta.correcto,
                datos: locales.map(l => {
                    const { _count, ...rest } = l;
                    return {
                        ...rest,
                        medios: _count.medios
                    }
                }),
                toast: 'Locales cargados correctamente'
            }
        } catch (error) {
            return ServicioErrores.prisma({ error, keys: [] as string[] })
        }
    }
    static async retrieve(id: number): Promise<Respuesta> {
        try {
            const localData = await DbLocales.model.findUnique({
                where: { id }, include: {
                    area: true,
                    _count: {
                        select: {
                            medios: true
                        }
                    }
                }
            });
            if (localData) {
                const { _count, ...local } = localData;
                return {
                    tipo: TipoRespuesta.correcto,
                    datos: { ...local, medios: _count.medios },
                    toast: `Local: ${local.nombre}, encontrada satisfactoriamente!`
                }
            } else {
                return {
                    tipo: TipoRespuesta.error,
                    toast: `El Local con id: ${id} no se encuentra.`
                }
            }
        } catch (error: unknown) {
            return ServicioErrores.prisma({ error, keys: ["id"] })
        }
    }
    static async create(formData: FormData): Promise<Respuesta> {
        const entries = Object.fromEntries(formData.entries());
        const { responsables, ...rest } = entries;
        const data = {
            ...rest,
            responsables: typeof responsables === 'string' ? responsables.split(';') : [],
        };
        const parsed = localSchema.safeParse(data);
        if (parsed.success) {
            const fields = { ...parsed.data, areaId: Number(parsed.data.areaId), responsables: parsed.data.responsables.join(";") };
            try {
                const local = await DbLocales.model.create({ data: fields });
                return {
                    tipo: TipoRespuesta.correcto,
                    datos: { ...local, medios: 0 },
                    toast: `Local: ${local.nombre}, creado satisfactoriamente!`
                }
            } catch (error: unknown) {
                return ServicioErrores.prisma({ error, keys: Object.keys(fields) })
            }
        } else {
            return {
                tipo: TipoRespuesta.error,
                toast: 'Verifique los campos con error.',
                errores: parsed.error.formErrors.fieldErrors
            }
        }
    }
    static async update(id: number, formData: FormData): Promise<Respuesta> {
        const entries = Object.fromEntries(formData.entries());
        const { responsables, eliminadoEn, ...rest } = entries;
        const data = {
            ...rest,
            responsables: typeof responsables === 'string' ? responsables.split(';') : [],
        };
        if (eliminadoEn && eliminadoEn === "null") {
            try {
                const localData = await DbLocales.model.update({
                    where: { id },
                    data: { eliminadoEn: null },
                    include: {
                        area: true,
                        _count: {
                            select: {
                                medios: true
                            }
                        }
                    }
                });
                const { _count, ...local } = localData;
                return {
                    tipo: TipoRespuesta.correcto,
                    datos: { ...local, medio: _count.medios },
                    toast: `Local: ${local.nombre}, restaurado satisfactoriamente!`
                }
            } catch (error: unknown) {
                return ServicioErrores.prisma({ error, keys: Object.keys({ eliminadoEn: null, id}) })
            }
        }
        const parsed = localSchema.safeParse(data);

        if (parsed.success) {
            const fields = { ...parsed.data, areaId: Number(parsed.data.areaId), responsables: parsed.data.responsables.join(";") };
            try {
                const localData = await DbLocales.model.update({
                    where: { id },
                    data: fields,
                    include: {
                        area:true,
                        _count: {
                            select: {
                                medios: true
                            }
                        }
                    }
                });
                const { _count, ...local } = localData;
                return {
                    tipo: TipoRespuesta.correcto,
                    datos: { ...local, medios: _count.medios },
                    toast: `Local: ${local.nombre}, actualizado satisfactoriamente!`
                }
            } catch (error: unknown) {
                return ServicioErrores.prisma({ error, keys: Object.keys(fields) })
            }
        } else {
            return {
                tipo: TipoRespuesta.error,
                toast: 'Verifique los campos con error.',
                errores: parsed.error.formErrors.fieldErrors
            }
        }
    }
    static async softDelete(id: number): Promise<Respuesta> {
        try {
            const localData = await DbLocales.model.update({
                where: { id },
                data: { eliminadoEn: new Date() }, include: {
                    area:true,
                    _count: {                        
                        select: {
                            medios: true
                        }
                    }
                }
            });
            const { _count, ...local } = localData;
            return {
                tipo: TipoRespuesta.correcto,
                datos: { ...local, medios: _count.medios },
                toast: `Área: ${local.nombre}, eliminado satisfactoriamente!`
            }
        } catch (error: unknown) {
            console.log(error);
            return ServicioErrores.prisma({ error, keys: ["id"] })
        }
    }
    static async delete(id: number): Promise<Respuesta> {
        try {
            const local = await DbLocales.model.delete({
                where: { id }
            });
            return {
                tipo: TipoRespuesta.correcto,
                datos: { ...local },
                toast: `Local: ${local.nombre}, eliminado satisfactoriamente!`
            }
        } catch (error: unknown) {
            return ServicioErrores.prisma({ error, keys: ["id"] })
        }
    }
}