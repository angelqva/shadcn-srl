import { create } from 'zustand'
import { Area, Local } from '@prisma/client';
import { Respuesta } from '../_types/type.response';
import { apiFetch } from '../_servicios/servicio.fetch';


export interface IObj extends Local {
  medios: number;
  area: Area;
}

const apiPath = "/locales"

interface StoreState {
  listado: IObj[]
  loading: boolean
  seleccion?: IObj
  list: () => Promise<void>
  revalidate: () => Promise<void>
  create: (data: FormData) => Promise<Respuesta>
  update: (id: number, data: FormData) => Promise<Respuesta>
  remove: (id: number, soft?: boolean) => Promise<Respuesta>
  setSeleccion: (id: number | undefined) => void
}

export const useStore = create<StoreState>((set, get) => ({
  listado: [] as IObj[],
  loading: true,
  seleccion: undefined,
  revalidate: async () => {
    const response = await apiFetch<IObj[]>({
      method: "GET",
      path: apiPath
    })
    if (response.datos) set({ listado: response.datos });
  },
  list: async () => {
    set({ loading: true })
    const response = await apiFetch<IObj[]>({
      method: "GET",
      path: apiPath
    })
    set({
      listado: response.datos ?? [] as IObj[],
      loading: false,
    })
  },
  create: async (data: FormData) => {
    const response = await apiFetch<IObj>({
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
    const response = await apiFetch<IObj>({
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
    const response = await apiFetch<IObj>({
      method: "DELETE",
      path: `${apiPath}/${id}`,
      query: { soft }
    })
    if (soft) {
      set((state) => ({
        listado: response.datos
          ? state.listado.map((a) =>
            a.id === id ? { ...response.datos as IObj } : a
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
    set((state) => ({
      seleccion: typeof id === "number"
        ? state.listado.find(a => a.id === id)
        : undefined
    }))
  }
}))
