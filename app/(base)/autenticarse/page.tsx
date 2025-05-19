import { getServerSession } from "next-auth";
import { FormAutenticarse } from "./_components/form"
import { ServicioNextAuth } from "@/app/_servicios/servicio.next-auth";
import { Informacion } from "./_components/informacion";

export default async function Page() {
    const session = await getServerSession(ServicioNextAuth.authOptions);
    if (!session) {
        return (
            <div className="w-full max-w-sm md:max-w-3xl mx-auto pt-10 md:pt-20">
                <FormAutenticarse />
            </div>
        )
    }
    return (
        <div className="w-full max-w-sm md:max-w-3xl mx-auto pt-10 md:pt-20">
            <Informacion user={{
                nombreCompleto: (session.user?.nombreCompleto as string) ?? "",
                correo: (session.user?.correo as string) ?? "",
            }} />
        </div>
    )
}