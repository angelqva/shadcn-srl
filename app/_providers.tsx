"use client";
import { HeroUIProvider } from '@heroui/react'
import { ToastProvider } from "@heroui/toast";
import { ThemeProvider } from 'next-themes';
import { SessionProvider } from "next-auth/react";
import { ReactNode } from 'react';
import { FeedBack } from '@/components/feedback';

export default function Providers({ children, feedback, deleteCookie }: { children: ReactNode, feedback: unknown, deleteCookie: (name: string) => Promise<void> }) {
  const feedBackValue = (typeof feedback === 'object' && feedback !== null && 'value' in feedback) ? feedback.value as string : undefined;
  return (
    <HeroUIProvider>
      <ThemeProvider defaultTheme='light'>
        <ToastProvider />
        <SessionProvider>
          {children}
        </SessionProvider>
        {feedBackValue && <FeedBack feedback={feedBackValue} deleteCookie={deleteCookie} />}
      </ThemeProvider>
    </HeroUIProvider>
  )
}