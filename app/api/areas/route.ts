import { NextResponse } from 'next/server'
import { ServicioNextAuth } from '@/app/_servicios/servicio.next-auth'
import { DbAreas } from '@/app/_db/db.areas'
import { TipoRespuesta } from '@/app/_types/type.response'

export async function GET() {
    const respuesta = await DbAreas.list();
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
    const respuesta = await DbAreas.create(form);
    return NextResponse.json(respuesta, { status: 200 })
}