import { create } from 'zustand'
import { Actividad } from '@prisma/client';
import { Respuesta } from '../_types/type.response';
import { apiFetch } from '../_servicios/servicio.fetch';


const apiPath = "/actividades"
interface ActividadesState {
  listado: Actividad[]
  loading: boolean
  seleccion?: Actividad
  list: () => Promise<void>
  revalidate: () => Promise<void>
  create: (data: FormData) => Promise<Respuesta>
  update: (id: number, data: FormData) => Promise<Respuesta>
  remove: (id: number, soft?: boolean) => Promise<Respuesta>
  setSeleccion: (id: number | undefined) => void
}

export const useActividadesStore = create<ActividadesState>((set, get) => ({
  listado: [] as Actividad[],
  loading: true,
  seleccion: undefined,
  revalidate: async () => {
    const response = await apiFetch<Actividad[]>({
      method: "GET",
      path: apiPath
    })
    if (response.datos) set({ listado: response.datos });
  },
  list: async () => {
    set({ loading: true })
    const response = await apiFetch<Actividad[]>({
      method: "GET",
      path: apiPath
    })
    set({
      listado: response.datos ?? [] as Actividad[],
      loading: false,
    })
  },
  create: async (data: FormData) => {
    const response = await apiFetch<Actividad>({
      method: "POST",
      path: apiPath,
      body: data
    })
    set((state) => ({
      listado: response.datos
        ? [...state.listado, response.datos]
        : state.listado
    }))
    get().revalidate();
    return response;
  },
  update: async (id: number, data: FormData) => {
    const response = await apiFetch<Actividad>({
      method: "PUT",
      path: `${apiPath}/${id}`,
      body: data
    })
    set((state) => ({
      listado: response.datos
        ? state.listado.map((a) =>
          a.id === id ? response.datos! : a
        )
        : state.listado,
    }))
    get().revalidate();
    return response;
  },
  remove: async (id: number, soft = false) => {
    const response = await apiFetch<Actividad>({
      method: "DELETE",
      path: `${apiPath}/${id}`,
      query: { soft }
    })
    if (soft) {
      set((state) => ({
        listado: response.datos
          ? state.listado.map((a) =>
            a.id === id ? { ...response.datos as Actividad } : a
          )
          : state.listado
      }))
    } else {
      set((state) => ({
        listado: response.datos
          ? state.listado.filter((a) => a.id !== id)
          : state.listado
      }))
    }
    get().revalidate();
    return response;
  },
  setSeleccion: (id: number | undefined) => {
    console.log('setSeleccion', { id });
    set((state) => ({
      seleccion: typeof id === "number"
        ? state.listado.find(a => a.id === id)
        : undefined
    }))
  }
}))
