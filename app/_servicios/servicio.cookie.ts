
import { cookies } from "next/headers";

export async function deleteCookie(name: string) {
    "use server";
    (await cookies()).delete(name);
}