import NextAuth, { AuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession } from 'next-auth'
import { ServicioLdap } from "@/app/_servicios/servicio.ldap";
import { ServicioUsuario } from "@/app/_servicios/servicio.usuario";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      correo: string;
      nombreCompleto: string;
      roles: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: number;
    correo: string;
    nombreCompleto: string;
    roles: string;
  }
}
export class ServicioNextAuth {
  static readonly authOptions: AuthOptions = {
    providers: [
      CredentialsProvider({
        name: "LDAP",
        credentials: {
          usuario: {
            label: "Usuario",
            type: "text",
            placeholder: "Entre su Usuario",
          },
          contraseña: {
            label: "Contraseña",
            type: "password",
            placeholder: "Entre su Contraseña",
          },
        },
        async authorize(credentials) {
          if (!credentials?.usuario || !credentials?.contraseña) {
            throw new Error(
              JSON.stringify({
                usuario: "Este campo es obligatorio",
                contraseña: "Este campo es obligatorio",
              }),
            );
          }
          const { errors, data } = await ServicioLdap.autenticarse(
            credentials.usuario,
            credentials.contraseña,
          );

          if (errors) {
            throw new Error(JSON.stringify(errors));
          }

          const res = await ServicioUsuario.crear({ ...data });

          if (res.datos) {
            return { ...res.datos.usuario };
          }
          if (res.errores) {
            throw new Error(JSON.stringify(res.errores));
          }
          if (!res.datos || !res.errores) {
            throw new Error(JSON.stringify({ toast: "Verifica tu conexión." }));
          }

          return null;
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user }: { token: any; user?: any }) {
        if (user) {
          token.id = user.id;
          token.correo = user.correo;
          token.nombreCompleto = user.nombreCompleto;
          token.roles = user.roles;
        }

        return token;
      },
      async session({ session, token }: { session: any; token: any }) {
        if (session.user) {
          session.user.id = token.id;
          session.user.correo = token.correo;
          session.user.nombreCompleto = token.nombreCompleto;
          session.user.roles = token.roles;
        }

        return session;
      },
    },
    session: {
      strategy: "jwt",
      maxAge: 7 * 24 * 60 * 60,
    },
    pages: {
      signIn: "/autenticarse",
    },
    debug: false,
  };

  static handler = NextAuth(ServicioNextAuth.authOptions);
  static async getSession() {
    const session = await getServerSession(ServicioNextAuth.authOptions);
    return session;

  }
  static async UsuarioConRoles(roles: string[]) {
    const session = await ServicioNextAuth.getSession();
    if(!session?.user) return null;
    const userRoles = session.user.roles;
    const haveRoles = roles.some((rol) => userRoles.includes(rol))
    if(haveRoles){
      return session.user;
    }
    return null;
  }
}
