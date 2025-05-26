import { DbLocales } from "@/app/_db/db.locales";
import { ServicioNextAuth } from "@/app/_servicios/servicio.next-auth";
import { TipoRespuesta } from "@/app/_types/type.response";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!id && isNaN(Number(id))) {
        return NextResponse.json({
            type: TipoRespuesta.error,
            toast: 'Proporcione un id válido'
        }, { status: 200 })
    }
    const usuario = await ServicioNextAuth.UsuarioConRoles(['gestor', 'administrador']);
    if (!usuario) {
        return NextResponse.json({
            type: TipoRespuesta.error,
            toast: 'No tiene suficientes permisos.'
        }, { status: 200 })
    }
    const respuesta = await DbLocales.retrieve(Number(id));
    return NextResponse.json(respuesta, { status: 200 })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!id && isNaN(Number(id))) {
        return NextResponse.json({
            type: TipoRespuesta.error,
            toast: 'Proporcione un id válido'
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
    const respuesta = await DbLocales.update(Number(id), form);
    return NextResponse.json(respuesta, { status: 200 })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!id && isNaN(Number(id))) {
        return NextResponse.json({
            type: TipoRespuesta.error,
            toast: 'Proporcione un id válido'
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
        const respuesta = await DbLocales.softDelete(Number(id));
        return NextResponse.json(respuesta, { status: 200 })
    }
    else {
        const respuesta = await DbLocales.delete(Number(id));
        return NextResponse.json(respuesta, { status: 200 })
    }
}
