import { DbAreas } from "@/app/_db/db.areas";
import { ServicioNextAuth } from "@/app/_servicios/servicio.next-auth";
import { TipoRespuesta } from "@/app/_types/type.response";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const numberId = Number(id);
    if (!id && isNaN(numberId)) {
        return NextResponse.json({
            type: TipoRespuesta.error,
            toast: 'Proporcione un código de Área válido'
        }, { status: 200 })
    }
    const usuario = await ServicioNextAuth.UsuarioConRoles(['gestor', 'administrador']);
    if (!usuario) {
        return NextResponse.json({
            type: TipoRespuesta.error,
            toast: 'No tiene suficientes permisos.'
        }, { status: 200 })
    }
    const respuesta = await DbAreas.retrieve(numberId);
    return NextResponse.json(respuesta, { status: 200 })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const numberId = Number(id);
    if (!id && isNaN(numberId)) {
        return NextResponse.json({
            type: TipoRespuesta.error,
            toast: 'Proporcione un código de Área válido'
        }, { status: 200 })
    }
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
    const respuesta = await DbAreas.update(numberId, form);
    return NextResponse.json(respuesta, { status: 200 })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const numberId = Number(id);
    if (!id && isNaN(numberId)) {
        return NextResponse.json({
            type: TipoRespuesta.error,
            toast: 'Proporcione un código de Área válido'
        }, { status: 200 })
    }
    const usuario = await ServicioNextAuth.UsuarioConRoles(['gestor', 'administrador']);
    if (!usuario) {
        return NextResponse.json({
            type: TipoRespuesta.error,
            toast: 'No tiene suficientes permisos.'
        }, { status: 200 })
    }
    const soft = req.nextUrl.searchParams.get('soft') === 'true';
    if (soft) {
        const respuesta = await DbAreas.softDelete(numberId);
        return NextResponse.json(respuesta, { status: 200 })
    }
    else {
        const respuesta = await DbAreas.delete(numberId);
        return NextResponse.json(respuesta, { status: 200 })
    }
}
