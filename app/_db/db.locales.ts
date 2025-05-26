import { ServicioPrisma } from "../_servicios/servicio.prisma";
import { areaSchema } from "../_schemas/schema.areas";
import { Respuesta, TipoRespuesta } from "../_types/type.response";
import { ServicioErrores } from "../_servicios/servicio.errores";

const prisma = ServicioPrisma.Client();

export class DbAreas {
    static model = prisma.area;
    static async list(): Promise<Respuesta> {
        try {
            const areas = await DbAreas.model.findMany({
                orderBy: { actualizadoEn: "desc" },
                include: {
                    _count: {
                        select: {
                            locales: true
                        }
                    }
                }
            });
            return {
                tipo: TipoRespuesta.correcto,
                datos: areas.map(a => {
                    const { _count, ...rest } = a;
                    return {
                        ...rest,
                        locales: _count.locales
                    }
                }),
                toast: 'Áreas cargadas correctamente'
            }
        } catch (error) {
            return ServicioErrores.prisma({ error, keys: [] as string[] })
        }
    }
    static async retrieve(codigo: string): Promise<Respuesta> {
        try {
            const areaData = await DbAreas.model.findUnique({
                where: { codigo }, include: {
                    _count: {
                        select: {
                            locales: true
                        }
                    }
                }
            });
            if (areaData) {
                const { _count, ...area } = areaData;
                return {
                    tipo: TipoRespuesta.correcto,
                    datos: { ...area, locales: _count.locales },
                    toast: `Área: ${area.nombre}, encontrada satisfactoriamente!`
                }
            } else {
                return {
                    tipo: TipoRespuesta.error,
                    toast: `El Área con código: ${codigo} no se encuentra.`
                }
            }
        } catch (error: unknown) {
            return ServicioErrores.prisma({ error, keys: ["codigo"] })
        }
    }
    static async create(formData: FormData): Promise<Respuesta> {
        const data = Object.fromEntries(formData.entries());
        const parsed = areaSchema.safeParse(data);
        if (parsed.success) {
            const fields = { ...parsed.data };
            try {
                const area = await DbAreas.model.create({ data: fields });
                return {
                    tipo: TipoRespuesta.correcto,
                    datos: { ...area, locales: 0 },
                    toast: `Área: ${area.nombre}, creada satisfactoriamente!`
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
    static async update(codigo: string, formData: FormData): Promise<Respuesta> {
        const data = Object.fromEntries(formData.entries());
        const { eliminadoEn, ...rest } = data;
        if (eliminadoEn && eliminadoEn === "null") {
            try {
                const areaData = await DbAreas.model.update({
                    where: { codigo },
                    data: { eliminadoEn: null },
                    include: {
                        _count: {
                            select: {
                                locales: true
                            }
                        }
                    }
                });
                const { _count, ...area } = areaData;
                return {
                    tipo: TipoRespuesta.correcto,
                    datos: { ...area, locales: _count.locales },
                    toast: `Área: ${area.nombre}, restaurada satisfactoriamente!`
                }
            } catch (error: unknown) {
                return ServicioErrores.prisma({ error, keys: Object.keys({ eliminadoEn: null }) })
            }
        }
        const parsed = areaSchema.safeParse(rest);

        if (parsed.success) {
            const fields = { ...parsed.data };
            try {
                const areaData = await DbAreas.model.update({
                    where: { codigo },
                    data: fields,
                    include: {
                        _count: {
                            select: {
                                locales: true
                            }
                        }
                    }
                });
                const { _count, ...area } = areaData;
                return {
                    tipo: TipoRespuesta.correcto,
                    datos: { ...area, locales: _count.locales },
                    toast: `Área: ${area.nombre}, actualizada satisfactoriamente!`
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
    static async softDelete(codigo: string): Promise<Respuesta> {
        try {
            const areaData = await DbAreas.model.update({
                where: { codigo },
                data: { eliminadoEn: new Date() }, include: {
                    _count: {
                        select: {
                            locales: true
                        }
                    }
                }
            });
            const { _count, ...area } = areaData;
            return {
                tipo: TipoRespuesta.correcto,
                datos: { ...area, locales: _count.locales },
                toast: `Área: ${area.nombre}, eliminada satisfactoriamente!`
            }
        } catch (error: unknown) {
            console.log(error);
            return ServicioErrores.prisma({ error, keys: ["codigo"] })
        }
    }
    static async delete(codigo: string): Promise<Respuesta> {
        try {
            const area = await DbAreas.model.delete({
                where: { codigo }
            });
            return {
                tipo: TipoRespuesta.correcto,
                datos: { ...area },
                toast: `Área: ${area.nombre}, eliminada satisfactoriamente!`
            }
        } catch (error: unknown) {
            return ServicioErrores.prisma({ error, keys: ["codigo"] })
        }
    }
}