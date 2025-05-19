import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { nextUrl } = req;
    const token = req.nextauth.token;

    if (!token) {
      return NextResponse.redirect(new URL("/autenticarse", req.url));
    }

    const roles = (token.roles as string[]) ?? "Usuario";

    if (
      nextUrl.pathname.startsWith("/panel/gestionar") &&
      !roles.includes("Administrador") &&
      !roles.includes("Gestor")
    ) {
      return NextResponse.redirect(new URL("/panel/401", req.url));
    }

    if (
      nextUrl.pathname.startsWith("/panel/controlar") &&
      !roles.includes("Administrador") &&
      !roles.includes("Responsable")
    ) {
      return NextResponse.redirect(new URL("/panel/401", req.url));
    }
    if (
      nextUrl.pathname.startsWith("/panel/asegurar") &&
      !roles.includes("Administrador") &&
      !roles.includes("Logístico")
    ) {
      return NextResponse.redirect(new URL("/panel/401", req.url));
    }
  },
  {
    pages: {
      signIn: "/autenticarse",
    },
  },
);

export const config = {
  matcher: ["/panel/:path*"],
};
