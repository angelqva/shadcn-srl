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
      !roles.includes("administrador") &&
      !roles.includes("gestor")
    ) {
      return NextResponse.redirect(new URL("/panel/401", req.url));
    }

    if (
      nextUrl.pathname.startsWith("/panel/controlar") &&
      !roles.includes("administrador") &&
      !roles.includes("responsable")
    ) {
      return NextResponse.redirect(new URL("/panel/401", req.url));
    }
    if (
      nextUrl.pathname.startsWith("/panel/asegurar") &&
      !roles.includes("administrador") &&
      !roles.includes("logístico")
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
