"use client";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Icon } from "@iconify/react";

import { BtnLink } from "./btn-link";

export function CardLinks({
  items,
}: {
  items: {
    nombre: string;
    href: string;
    icon: string;
    btnLabel?: string;
  }[];
}) {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-semibold text-secondary-800 mb-5">
        Acciones Rápidas
      </h2>
      <div className="flex flex-wrap gap-5">
        {items.map(({ nombre, href, icon, btnLabel }) => (
          <Card
            key={`card-link-${nombre}`}
            className="bg-secondary-200/15 w-full md:max-w-xs hover:shadow-lg"
          >
            <CardHeader className="justify-between min-h-20">
              <div className="flex items-center">
                <Icon
                  className="w-12 h-12 min-w-12 text-secondary-600"
                  icon={icon}
                />
                <h3 className="text-xl text-secondary-800 pl-2 font-semibold">
                  {nombre}
                </h3>
              </div>
              <Icon
                className="w-8 h-8 text-secondary-600"
                icon="solar:database-line-duotone"
              />
            </CardHeader>
            <CardBody>
              <BtnLink
                className="w-full text-lg font-semibold"
                href={href}
                icon={
                  <Icon
                    className="w-7 h-7 text-white"
                    icon="solar:widget-add-bold-duotone"
                  />
                }
              >
                {btnLabel ?? "Gestionar"}
              </BtnLink>
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  );
}
