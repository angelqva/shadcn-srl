"use client";
import { ReactNode, useEffect, useRef } from "react";
import { useAreasStore } from "../_store/store.areas";

export const ProviderAreas = ({ children }: { children: ReactNode }) => {
  const { listado, list, revalidate } = useAreasStore();
  const initializedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scheduleRevalidation = () => {
    const nextDelay = Math.floor(Math.random() * (15 - 10 + 1) + 10) * 60 * 1000; // 10–15 min
    timeoutRef.current = setTimeout(() => {
      revalidate();
      scheduleRevalidation(); // programa la siguiente
    }, nextDelay);
  };

  useEffect(() => {
    if (!initializedRef.current && listado.length === 0) {
      list();
      initializedRef.current = true;
    }

    scheduleRevalidation();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [listado.length, list, revalidate]);

  return <>{children}</>;
};
