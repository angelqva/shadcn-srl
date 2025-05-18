"use client";
import { HeroUIProvider } from '@heroui/react'
import { ToastProvider } from "@heroui/toast";
import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <HeroUIProvider>
      <ThemeProvider defaultTheme='light'>
        <ToastProvider />
        {children}
      </ThemeProvider>
    </HeroUIProvider>
  )
}