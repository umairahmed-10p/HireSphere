'use client';

import type React from "react"
import { Inter } from "next/font/google"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AppSidebar } from "@/components/app-sidebar"
import { MainNav } from "@/components/main-nav"
import { usePathname } from 'next/navigation'

import "@/app/globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <SidebarProvider>
            <LayoutContent>{children}</LayoutContent>
          </SidebarProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideSidebar = pathname?.startsWith('/login') || pathname?.startsWith('/register');

  return (
    <div className="flex min-h-screen">
      {!hideSidebar && <AppSidebar />}
      <div className={`flex-1 flex flex-col min-w-0 ${hideSidebar ? 'w-full' : ''}`}>
        {!hideSidebar && <MainNav />}
        <div className="flex-1 overflow-y-auto">
          <div className="h-full max-w-[1600px] w-full mx-auto px-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

import './globals.css'