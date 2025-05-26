import { Respuesta, TipoRespuesta } from "../_types/type.response";

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ApiFetchOptions {
    method?: HTTPMethod;
    path: string;
    body?: unknown;
    query?: Record<string, string | number | boolean>;
    headers?: Record<string, string>;
}

function buildQuery(params: Record<string, string | number | boolean> = {}) {
    const esc = encodeURIComponent;
    const qs = Object.entries(params)
        .map(([k, v]) => `${esc(k)}=${esc(String(v))}`)
        .join('&');
    return qs ? `?${qs}` : '';
}

export async function apiFetch<T>({
    method = 'GET',
    path,
    body,
    query,
    headers = {},
}: ApiFetchOptions): Promise<Respuesta<T>> {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || '';
    const url = `${baseURL}${path}${buildQuery(query)}`;
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    const defaultHeaders: Record<string, string> = isFormData
        ? {}
        : { 'Content-Type': 'application/json' };

    const res = await fetch(url, {
        method,
        headers: { ...defaultHeaders, ...headers },
        body: isFormData ? body : body != null ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
        const errorText = await res.text();
        return {
            tipo: TipoRespuesta.error,
            toast: "Fallo la petición. " + errorText
        }
    }

    try {
        const json = await res.json();
        return json as Respuesta<T>;
    } catch {
        return {
            tipo: TipoRespuesta.error,
            toast: "Fallo la petición. Ver logs para mas información "
        }
    }
}