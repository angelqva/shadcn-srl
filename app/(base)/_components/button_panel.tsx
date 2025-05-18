"use client"
import { Button } from "@heroui/react";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function BtnPanel() {
    return <Button
        as={Link}
        className="font-semibold"
        color="secondary"
        href="/panel"
        startContent={<LayoutDashboard />}
        size="lg"
        variant="shadow"
    >
        Panel de Trabajo
    </Button>
}