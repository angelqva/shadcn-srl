import { z } from "zod";

import {
  arrayEmailsSchema,
  stringMinLengthSchema
} from ".";

export const localNombreSchema = z.object({
  nombre: stringMinLengthSchema,
});

export const localCodigoSchema = z.object({
  codigo: stringMinLengthSchema,
});

export const localUbicacionSchema = z.object({
  ubicacion: stringMinLengthSchema,
});

export const localDescripcionSchema = z.object({
  descripcion: stringMinLengthSchema,
});

export const localResponsablesSchema = z.object({
  responsables: arrayEmailsSchema,
});

export const localAreaSchema = z.object({
  areaId: z
    .string()
    .refine((val) => !isNaN(Number(val)), {
      message: "Seleccione un Área",
    }),
});

export const localSchema = localNombreSchema
  .merge(localCodigoSchema)
  .merge(localUbicacionSchema)
  .merge(localDescripcionSchema)
  .merge(localResponsablesSchema)
  .merge(localAreaSchema);