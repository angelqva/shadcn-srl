export enum TipoRespuesta {
    correcto = "success",
    error = "danger",
    alerta = "warning",
    informacion = "primary"
}

export type TipoRespuestaValor = `${TipoRespuesta}`;
export type TipoError = Record<string, string | string[] | undefined>
export interface Respuesta<T = unknown>{
    tipo: TipoRespuestaValor,
    datos?: T,
    errores?: Record<string, string | string[] | undefined>
    toast?: string
}