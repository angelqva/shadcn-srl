import { ServicioNextAuth } from "@/app/_servicios/servicio.next-auth";

const handler = ServicioNextAuth.handler;

export { handler as GET, handler as POST };
