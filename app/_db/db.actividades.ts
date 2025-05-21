import { Prisma, Actividad } from "@prisma/client";
import { ServicioPrisma } from "../_servicios/servicio.prisma";
import { actividadSchema } from "../_schemas/schema.actividades";

const prisma = ServicioPrisma.Client();

export class DbActividades {
  static model = prisma.actividad;
  static async list(): Promise<Actividad[]> {
    return await DbActividades.model.findMany({
      orderBy: { actualizadoEn: "desc" },
      where: { eliminadoEn: null }
    });
  }

  static async retrieve(id: number): Promise<Actividad | null> {
    return await DbActividades.model.findUnique({ where: { id } });
  }

  static async create(formData: FormData) {
    const data = Object.fromEntries(formData.entries());
    const parsed = actividadSchema.safeParse(data);

    if (parsed.success) {
      const fields = { ...parsed.data };

      try {
        return await DbActividades.model.create({ data: fields });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            // Unique constraint violation
            const target = error.meta?.target as string[];

            if (target?.includes("nombre")) {
              throw new Error(
                JSON.stringify({
                  nombre: "Este campo ya existe en la base de datos",
                }),
              );
            }
          }
          if (error.code === "P2025") {
            throw new Error(
              JSON.stringify({
                toast: `Actualice, el objeto no existe en la Base de Datos`,
              }),
            );
          }
          throw new Error(
            JSON.stringify({
              toast: `Error de base de datos: ${error.code}, por favor enviar al administrador`,
            }),
          );
        }
        throw new Error(
          JSON.stringify({
            toast: "Compruebe su conexión",
          }),
        );
      }
    } else {
      const fieldErrors = { ...parsed.error.formErrors.fieldErrors };

      throw new Error(JSON.stringify(fieldErrors));
    }
  }

  static async update(id: number, formData: FormData) {
    const data = Object.fromEntries(formData.entries());
    const parsed = actividadSchema.safeParse(data);

    if (parsed.success) {
      const fields = { ...parsed.data };

      try {
        return await DbActividades.model.update({
          where: { id },
          data: fields,
        });
      } catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            // Unique constraint violation
            const target = error.meta?.target as string[];

            if (target?.includes("nombre")) {
              throw new Error(
                JSON.stringify({
                  nombre: "Este campo ya existe en la base de datos",
                }),
              );
            }
          }
          if (error.code === "P2025") {
            throw new Error(
              JSON.stringify({
                toast: `Actualice, el objeto no existe en la Base de Datos`,
              }),
            );
          }
          throw new Error(
            JSON.stringify({
              toast: `Error de base de datos: ${error.code}, por favor enviar al administrador`,
            }),
          );
        }
        throw new Error(
          JSON.stringify({
            toast: "Compruebe su conexión",
          }),
        );
      }
    } else {
      const fieldErrors = { ...parsed.error.formErrors.fieldErrors };

      throw new Error(JSON.stringify(fieldErrors));
    }
  }
  static async softDelete(id: number) {
    try {
      return await DbActividades.model.update({
        where: { id },
        data: { eliminadoEn: new Date() },
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          // Unique constraint violation
          const target = error.meta?.target as string[];

          if (target?.includes("nombre")) {
            throw new Error(
              JSON.stringify({
                nombre: "Este campo ya existe en la base de datos",
              }),
            );
          }
        }
        if (error.code === "P2025") {
          throw new Error(
            JSON.stringify({
              toast: `Actualice, el objeto no existe en la Base de Datos`,
            }),
          );
        }
        throw new Error(
          JSON.stringify({
            toast: `Error de base de datos: ${error.code}, por favor enviar al administrador`,
          }),
        );
      }
      throw new Error(
        JSON.stringify({
          toast: "Compruebe su conexión",
        }),
      );
    }
  }
  static async delete(id: number) {
    return await DbActividades.model.delete({ where: { id } });
  }
}