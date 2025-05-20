"use client"
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

import Link from "next/link";

export function BtnPanel() {
    return <Button
        as={Link}
        className="font-semibold"
        color="secondary"
        href="/panel"
        startContent={<Icon
            className="!size-6"
            icon="solar:slider-vertical-bold-duotone"
        />}
        size="lg"
        variant="shadow"
    >
        Panel del Sistema
    </Button>
}