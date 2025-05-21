import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleErrors = (error: unknown) => {
  if (error instanceof Error) {
    try {
      const parsedErrors = JSON.parse(error.message) as Record<
        string,
        string | string[]
      >;

      if (!parsedErrors.toast) {
        parsedErrors["toast"] = "Verifique los campos con error";
      }

      return parsedErrors;
    } catch (err) {
      return {
        toast: `Muestre este error al administrador: ${error.message}`,
      } as Record<string, string | string[]>;
    }
  }
};

export function capitalize(str: string): string {
  return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
}