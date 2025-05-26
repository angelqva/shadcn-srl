import { NextResponse } from 'next/server'
import { ServicioNextAuth } from '@/app/_servicios/servicio.next-auth'
import { DbActividades } from '@/app/_db/db.actividades'
import { TipoRespuesta } from '@/app/_types/type.response'

export async function GET() {
    const respuesta = await DbActividades.list();
    return NextResponse.json(respuesta, { status: 200 })
}

export async function POST(req: Request) {
    const usuario = await ServicioNextAuth.UsuarioConRoles(['gestor', 'administrador']);
    if (!usuario) {
        return NextResponse.json({
            type: TipoRespuesta.error,
            toast: 'No tiene suficientes permisos.'
        }, { status: 200 })
    }
    let form: FormData | undefined;
    try {
        form = await req.formData();
    } catch (error: unknown) {
        console.log(error);
    }
    if (!form) {
        return NextResponse.json({
            type: TipoRespuesta.error,
            toast: 'No ha enviado datos válidos.'
        }, { status: 200 })
    }
    const respuesta = await DbActividades.create(form);
    return NextResponse.json(respuesta, { status: 200 })
}