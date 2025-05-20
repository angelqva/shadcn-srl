"use client";
import { Link, Button } from "@heroui/react";
import { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function BtnLink({
  children,
  className,
  href,
  icon,
  color,
}: {
  children: ReactNode;
  href: string;
  className?: string;
  icon?: ReactNode;
  color?:
    | "secondary"
    | "default"
    | "primary"
    | "success"
    | "warning"
    | "danger";
}) {
  return (
    <Button
      as={Link}
      className={cn(
        className ?? "w-full md:w-fit px-6 py-8 font-semibold text-lg",
      )}
      color={color ?? "secondary"}
      href={href}
      startContent={icon}
    >
      {children}
    </Button>
  );
}
