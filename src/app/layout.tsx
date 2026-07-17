import { AppSidebar } from "@/components/shared/app-sidebar"
import { MobileDock } from "@/components/shared/mobile-dock"
import { ThemeProvider } from "@/components/ThemeProvider"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { Geist_Mono } from "next/font/google"
import localFont from "next/font/local"
import "./globals.css"

const sfPro = localFont({
  src: "../../public/fonts/SF-Pro.ttf",
  variable: "--font-sans",
  weight: "100 900",
  style: "normal",
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const viewport: Viewport = {
  themeColor: "#09090B",
  initialScale: 1,
  width: "device-width",
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: "Ascend — Habit tracker",
  description: "An offline-first habit tracker for building better routines.",
  applicationName: "Ascend",
  appleWebApp: {
    capable: true,
    title: "Ascend",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Ascend",
    title: "Ascend — Habit tracker",
    description: "An offline-first habit tracker for building better routines.",
  },
  twitter: {
    card: "summary",
    title: "Ascend — Habit tracker",
    description: "An offline-first habit tracker for building better routines.",
  },
}

import { auth } from "@/auth"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", sfPro.variable, geistMono.variable, "font-sans")}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider delayDuration={0}>
            <SidebarProvider>
              {session ? (
                <>
                  <AppSidebar />
                  <SidebarInset className="bg-background">
                    <main className="flex w-full flex-1 flex-col pb-28 md:pb-0">{children}</main>
                    <MobileDock />
                  </SidebarInset>
                </>
              ) : (
                <main className="flex w-full flex-1 flex-col">{children}</main>
              )}
            </SidebarProvider>
          </TooltipProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
