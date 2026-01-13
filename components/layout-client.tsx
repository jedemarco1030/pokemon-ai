"use client"

import type React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Toaster } from "sonner"
import { useAuth } from "@/components/auth-provider"
import { PokeChatOverlay } from "@/components/pokechat-overlay"
import { Analytics } from "@vercel/analytics/next"

export function LayoutClient({ children }: { children: React.ReactNode }) {
    const { user } = useAuth()
    return (
        <div className="flex flex-col min-h-screen">
            <Header user={user} />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
            <PokeChatOverlay />
            <Toaster position="top-center" />
            <Analytics />
        </div>
    )
}
