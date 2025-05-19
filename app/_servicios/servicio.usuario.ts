import { Usuario } from "@prisma/client";
import { z } from "zod";

import { ServicioPrisma } from "./servicio.prisma";
const prisma = ServicioPrisma.Client();

// Esquemas Zod para validación
export const EsquemaCrearUsuario = z.object({
  correo: z.string().email(),
  nombreCompleto: z.string().min(1),
  roles: z.string().optional(),
});

export const EsquemaActualizarUsuario = z.object({
  id: z.number(),
  correo: z.string().email().optional(),
  nombreCompleto: z.string().min(1).optional(),
  roles: z.string().optional(),
});

// Tipos TypeScript derivados de los esquemas
export type EntradaCrearUsuario = z.infer<typeof EsquemaCrearUsuario>;
export type EntradaActualizarUsuario = z.infer<typeof EsquemaActualizarUsuario>;

/**
 * Servicio CRUD de Usuario en español.
 */
export class ServicioUsuario {
  /**
   * Crea un nuevo usuario.
   */
  static async crear(datos: unknown): Promise<{
    datos?: { usuario: Usuario };
    errores?: Record<string, string | undefined>;
  }> {
    const validatedData = EsquemaCrearUsuario.safeParse(datos);

    if (validatedData.success) {
      // TODO: agregar logica para ldap roles
      const roles = JSON.stringify(["usuario"]);

      try {
        const usuario = await prisma.usuario.upsert({
          where: { correo: validatedData.data.correo },
          update: { nombreCompleto: validatedData.data.nombreCompleto },

          create: {
            correo: validatedData.data.correo,
            nombreCompleto: validatedData.data.nombreCompleto,
            roles,
          },
        });

        return { datos: { usuario } };
      } catch (error) {
        console.log(error);

        return {
          errores: {
            toast: "Necesita rellenar los roles de la base de datos",
          },
        };
      }
    }

    return {
      errores: {
        correo: validatedData.error.formErrors.fieldErrors.correo?.join(", "),
        nombreCompleto:
          validatedData.error.formErrors.fieldErrors.nombreCompleto?.join(", "),
        toast: "Verifique los campos con error",
      },
    };
  }

  /**
   * Obtiene un usuario por su ID.
   */
  static async obtenerPorId(id: number): Promise<Usuario | null> {
    return prisma.usuario.findUnique({ where: { id } });
  }

  /**
   * Obtiene todos los usuarios activos (sin eliminadoEn).
   */
  static async obtenerTodos(): Promise<Usuario[]> {
    return prisma.usuario.findMany({ where: { eliminadoEn: null } });
  }

  /**
   * Actualiza un usuario existente.
   */
  static async actualizar(datos: EntradaActualizarUsuario): Promise<Usuario> {
    const validado = EsquemaActualizarUsuario.parse(datos);
    const { id, ...resto } = validado;

    return prisma.usuario.update({ where: { id }, data: resto });
  }

  /**
   * Elimina (soft delete) un usuario marcando eliminadoEn.
   */
  static async eliminar(id: number): Promise<Usuario> {
    return prisma.usuario.update({
      where: { id },
      data: { eliminadoEn: new Date() },
    });
  }
}
