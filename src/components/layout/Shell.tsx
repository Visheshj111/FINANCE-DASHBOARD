"use client";

import { useTheme } from "next-themes";
import { useFinance } from "@/context/FinanceContext";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { role, setRole, setIsAddModalOpen } = useFinance();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between bg-white dark:bg-black px-4 sm:px-6 lg:px-8">
      <button 
        type="button" 
        className="text-black dark:text-white lg:hidden border border-black dark:border-white px-3 py-1 font-medium text-sm"
        onClick={toggleSidebar}
      >
        Menu
      </button>

      <div className="flex flex-1" />
      
      <div className="flex items-center gap-x-6">
        {mounted && (
          <button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="text-sm font-bold uppercase tracking-widest bg-white dark:bg-black text-black dark:text-white border px-3 py-1 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
          >
            {resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        )}

        <div className="flex items-center gap-3 border-l border-black dark:border-white pl-6">
          <span className="text-sm font-medium text-black dark:text-white">Role:</span>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value as any)}
            className="text-sm bg-white dark:bg-black border border-black dark:border-white py-1 px-2 text-black dark:text-white cursor-pointer"
          >
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
    </header>
  );
}

export function Sidebar({ open, setOpen }: { open: boolean, setOpen: (o: boolean) => void }) {
  const pathname = usePathname();

  const nav = [
    { name: 'Dashboard', href: '/' },
    { name: 'Transactions', href: '/transactions' },
    { name: 'Settings', href: '/settings' },
  ];

  return (
    <>
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform bg-white dark:bg-black border-r border-black dark:border-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:flex lg:flex-col",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-black dark:border-white">
          <div className="font-bold text-xl tracking-widest uppercase text-black dark:text-white">
            Finance App
          </div>
        </div>
        <nav className="flex flex-1 flex-col py-8">
          <ul role="list" className="flex flex-1 flex-col">
            {nav.map((item) => {
              const current = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      current
                        ? 'bg-black text-white dark:bg-white dark:text-black font-bold border border-transparent'
                        : 'text-black dark:text-white bg-transparent border border-transparent border-t-0 hover:bg-gray-100 dark:hover:bg-gray-900',
                      'block px-6 py-4 text-sm uppercase tracking-widest transition-colors w-full text-left'
                    )}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-white dark:bg-black text-black dark:text-white overflow-hidden font-sans">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex flex-1 flex-col min-w-0 overflow-y-auto">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
