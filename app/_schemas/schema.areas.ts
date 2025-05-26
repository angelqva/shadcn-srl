import { z } from "zod";

import {
  stringMinLengthSchema
} from ".";

export const areaNombreSchema = z.object({
  nombre: stringMinLengthSchema,
});

export const areaCodigoSchema = z.object({
  codigo: stringMinLengthSchema,
});

export const areaUbicacionSchema = z.object({
  ubicacion: stringMinLengthSchema,
});

export const areaDescripcionSchema = z.object({
  descripcion: stringMinLengthSchema,
});

export const areaSchema = areaNombreSchema
  .merge(areaCodigoSchema)
  .merge(areaUbicacionSchema)
  .merge(areaDescripcionSchema);