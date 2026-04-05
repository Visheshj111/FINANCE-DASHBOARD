"use client";

import { ThemeProvider } from "next-themes";
import { FinanceProvider } from "@/context/FinanceContext";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <FinanceProvider>
        {children}
      </FinanceProvider>
    </ThemeProvider>
  );
}
