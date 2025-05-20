"use client";
import {
    Navbar as HeroUINavbar,
    NavbarContent,
    NavbarBrand,
    NavbarItem,
    Button,
} from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";

export const Navbar = () => {
    return (
        <HeroUINavbar maxWidth="xl" position="sticky">
            <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
                <NavbarBrand as="li" className="gap-3 max-w-fit">
                    <Link className="flex items-center justify-start gap-1 text-secondary-700" href="/">
                        <Icon icon="solar:calendar-bold-duotone" className="size-7 sm:size-8" />
                        <span className="text-lg font-bold sm:text-xl text-inherit">SGRL-UC</span>
                    </Link>
                </NavbarBrand>
            </NavbarContent>
            <NavbarContent className="pl-4" justify="end">
                <NavbarItem className="flex">
                    <Button
                        as={Link}
                        className="text-sm font-semibold"
                        color="secondary"
                        href="/autenticarse"
                        startContent={<Icon
                            className="size-7"
                            icon="solar:shield-keyhole-bold"
                        />}
                        variant="ghost"
                    >
                        Autenticarse
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </HeroUINavbar>
    );
};
