"use client"

import { useEffect, useState } from "react"

export function useTheme() {
    const [mounted, setMounted] = useState(false)
    const [theme, setTheme] = useState<"light" | "dark">(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("theme") as "light" | "dark" | null
            if (stored) return stored
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
            return prefersDark ? "dark" : "light"
        }
        return "dark"
    })

    useEffect(() => {
        const initMounted = () => setMounted(true)
        initMounted()
        document.documentElement.classList.toggle("dark", theme === "dark")
    }, [theme])

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark"
        setTheme(newTheme)
        localStorage.setItem("theme", newTheme)
        document.documentElement.classList.toggle("dark", newTheme === "dark")
    }

    return { theme, toggleTheme, mounted }
}
