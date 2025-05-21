import { z } from "zod";

import { stringMinLengthSchema } from ".";

export const actividadNombreSchema = z.object({
  nombre: stringMinLengthSchema,
});

export const actividadIconoSchema = z.object({
  icono: stringMinLengthSchema,
});

export const actividadDescripcionSchema = z.object({
  descripcion: stringMinLengthSchema,
});

export const actividadSchema = actividadNombreSchema
  .merge(actividadDescripcionSchema)
  .merge(actividadIconoSchema);