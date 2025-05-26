import { ServicioPrisma } from "../_servicios/servicio.prisma";
import { actividadSchema } from "../_schemas/schema.actividades";
import { Respuesta, TipoRespuesta } from "../_types/type.response";
import { ServicioErrores } from "../_servicios/servicio.errores";

const prisma = ServicioPrisma.Client();

export class DbActividades {
  static model = prisma.actividad;
  static async list(): Promise<Respuesta> {
    try {
      const actividades = await DbActividades.model.findMany({
        orderBy: { actualizadoEn: "desc" }
      });
      return {
        tipo: TipoRespuesta.correcto,
        datos: actividades,
        toast: 'Actividades cargadas correctamente'
      }
    } catch (error) {
      return ServicioErrores.prisma({ error, keys: [] as string[] })
    }
  }
  static async retrieve(id: number): Promise<Respuesta> {
    try {
      const actividad = await DbActividades.model.findUnique({ where: { id } });
      if (actividad) {
        return {
          tipo: TipoRespuesta.correcto,
          datos: { ...actividad },
          toast: `Actividad: ${actividad.nombre}, encontrada satisfactoriamente!`
        }
      } else {
        return {
          tipo: TipoRespuesta.error,
          errores: {
            id: `La actividad con id: ${id} no se encuentra.`
          },
          toast: `No se encuentra en la base de datos`
        }
      }
    } catch (error: unknown) {
      return ServicioErrores.prisma({ error, keys: ["id"] })
    }
  }
  static async create(formData: FormData): Promise<Respuesta> {
    const data = Object.fromEntries(formData.entries());
    const parsed = actividadSchema.safeParse(data);
    if (parsed.success) {
      const fields = { ...parsed.data };
      try {
        const actividad = await DbActividades.model.create({ data: fields });
        return {
          tipo: TipoRespuesta.correcto,
          datos: { ...actividad },
          toast: `Actividad: ${actividad.nombre}, creada satisfactoriamente!`
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
    const data = Object.fromEntries(formData.entries());
    const { eliminadoEn, ...rest } = data;
    if (eliminadoEn && eliminadoEn === "null") {
      try {
        const actividad = await DbActividades.model.update({
          where: { id },
          data: { eliminadoEn: null },
        });
        return {
          tipo: TipoRespuesta.correcto,
          datos: { ...actividad },
          toast: `Actividad: ${actividad.nombre}, restaurada satisfactoriamente!`
        }
      } catch (error: unknown) {
        return ServicioErrores.prisma({ error, keys: Object.keys({ eliminadoEn: null }) })
      }
    }
    const parsed = actividadSchema.safeParse(rest);

    if (parsed.success) {
      const fields = { ...parsed.data };
      try {
        const actividad = await DbActividades.model.update({
          where: { id },
          data: fields,
        });
        return {
          tipo: TipoRespuesta.correcto,
          datos: { ...actividad },
          toast: `Actividad: ${actividad.nombre}, actualizada satisfactoriamente!`
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
      const actividad = await DbActividades.model.update({
        where: { id },
        data: { eliminadoEn: new Date() },
      });
      return {
        tipo: TipoRespuesta.correcto,
        datos: { ...actividad },
        toast: `Actividad: ${actividad.nombre}, eliminada satisfactoriamente!`
      }
    } catch (error: unknown) {
      return ServicioErrores.prisma({ error, keys: ["id"] })
    }
  }
  static async delete(id: number): Promise<Respuesta> {
    try {
      const actividad = await DbActividades.model.delete({
        where: { id }
      });
      if (!actividad) {
        return {
          tipo: TipoRespuesta.error,
          toast: `No se encontro la Actividad con id: ${id}`
        }
      }
      return {
        tipo: TipoRespuesta.correcto,
        datos: { ...actividad },
        toast: `Actividad: ${actividad.nombre}, eliminada satisfactoriamente!`
      }
    } catch (error: unknown) {
      return ServicioErrores.prisma({ error, keys: ["id"] })
    }
  }
}