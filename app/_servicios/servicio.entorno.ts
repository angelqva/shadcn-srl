import { z } from "zod";

export const EsquemaEntorno = z.object({
  LDAP_URL: z.string().url(),
  LDAP_DOMAIN: z.string(),
  CATALAGO: z.string(),
  DN: z.string(),
  LDAP_ADMIN: z.string(),
  LDAP_PASSWORD: z.string(),
  SECRET: z.string(),
  PRODUCTION: z.union([z.literal("0"), z.literal("1")]).default("0"),
  AUTH_SECRET: z.string(),
  DATABASE_URL: z.string().url(),
});

export class ServicioEntorno {
  static constantes() {
    return EsquemaEntorno.parse(process.env);
  }
}
