"use client";

import { Button } from "@heroui/button";
import { signOut } from "next-auth/react";
import { Icon } from "@iconify/react";
import { ReactNode } from "react";

export function LogoutButton({
  children,
  className,
  color,
  variant,
  size
}: {
  className?:string;
  children: ReactNode;
  size?:"sm" | "md" | "lg"
  color?:
    | "warning"
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "danger";
  variant?:
    | "bordered"
    | "solid"
    | "light"
    | "flat"
    | "faded"
    | "shadow"
    | "ghost";
}) {
  return (
    <Button
      className={className ?? ""}
      color={color}
      size={size}
      startContent={<Icon height="24" icon="hugeicons:logout-04" width="24" />}
      variant={variant}
      onPress={() => signOut({ callbackUrl: "/" })}
    >
      {children}
    </Button>
  );
}
