"use client"

import Link from "next/link"
import { Moon, Sun, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/hooks/use-theme"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { getProfile, createOrUpdateProfile } from "@/app/actions/pokemon"

type UserProfile = {
    first_name: string | null
    last_name: string | null
    email: string | null
}

export function Header({ user }: { user: User | null }) {
    const { theme, toggleTheme } = useTheme()
    const [profile, setProfile] = useState<UserProfile | null>(null)
    // const [loading, setLoading] = useState(true)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const fetchProfile = async () => {
            if (user) {
                try {
                    console.log("[Header] Fetching profile for user:", user.id)
                    const existingProfile = await getProfile(user.id)

                    if (existingProfile) {
                        console.log("[Header] Profile found:", existingProfile)
                        setProfile(existingProfile as UserProfile)
                    } else {
                        console.log("[Header] No profile found, creating one...")
                        const firstName = user.user_metadata?.first_name || "User"
                        const lastName = user.user_metadata?.last_name || ""
                        const email = user.email || ""

                        const newProfile = await createOrUpdateProfile(user.id, {
                            first_name: firstName,
                            last_name: lastName,
                            email: email,
                        })

                        if (newProfile) {
                            console.log("[Header] New profile created:", newProfile)
                            setProfile(newProfile as UserProfile)
                        } else {
                            // If createOrUpdateProfile returns null (caught error), use fallback
                            console.warn("[Header] Failed to create profile, using fallback.")
                            setProfile({
                                first_name: (user.user_metadata?.first_name as string) || "User",
                                last_name: (user.user_metadata?.last_name as string) || "",
                                email: user.email || "",
                            })
                        }
                    }
                } catch (err) {
                    console.error("[Header] Error in fetchProfile:", err)
                    // Fallback to user metadata if database fails
                    setProfile({
                        first_name: (user.user_metadata?.first_name as string) || "User",
                        last_name: (user.user_metadata?.last_name as string) || "",
                        email: user.email || "",
                    })
                }
            } else {
                setProfile(null)
            }
        }

        fetchProfile()
    }, [user])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push("/")
    }

    const displayName = profile?.first_name || user?.user_metadata?.first_name || "Guest"

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Left: Logo and Brand */}
                <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="relative w-10 h-10">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                            <circle
                                cx="50"
                                cy="50"
                                r="48"
                                fill="currentColor"
                                className="text-primary"
                                stroke="currentColor"
                                strokeWidth="2"
                            />
                            <circle cx="50" cy="50" r="40" fill="currentColor" className="text-background" />
                            <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="3" className="text-foreground" />
                            <circle
                                cx="50"
                                cy="50"
                                r="12"
                                fill="currentColor"
                                className="text-foreground"
                                stroke="currentColor"
                                strokeWidth="2"
                            />
                            <circle cx="50" cy="50" r="6" fill="currentColor" className="text-background" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Pokemon AI
          </span>
                </Link>

                {/* Right: Navigation Links and Theme Toggle */}
                <div className="flex items-center gap-2 sm:gap-4 relative z-[60]">
                    <span className="text-xs sm:text-sm font-medium hidden sm:inline-block">Welcome, {displayName}!</span>

                    {user && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="gap-1 sm:gap-2 cursor-pointer touch-manipulation active:opacity-70">
                                    Features <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem asChild>
                                    <Link href="/pokesearch" className="w-full font-medium text-primary">PokéSearch</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/poke-news" className="w-full">Poke-News & Meta</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/ai-search" className="w-full">AI Search</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/journal" className="w-full">Journal</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/games" className="w-full">Games</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/move-optimizer" className="w-full">Optimizer</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/recommendations" className="w-full">Recommendations</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/battle-simulator" className="w-full">Battle Sim</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/whos-that-pokemon" className="w-full">Who&apos;s That?</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/catch-predictor" className="w-full">Catch Predictor</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/favorites" className="w-full">Favorites</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/team-builder" className="w-full">Team Builder</Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {user ? (
                        <Button variant="ghost" size="sm" onClick={handleLogout} className="cursor-pointer touch-manipulation active:opacity-70">
                            Logout
                        </Button>
                    ) : (
                        <>
                            <Button variant="ghost" size="sm" asChild className="cursor-pointer touch-manipulation active:opacity-70">
                                <Link href="/register">Register</Link>
                            </Button>
                            <Button variant="ghost" size="sm" asChild className="cursor-pointer touch-manipulation active:opacity-70">
                                <Link href="/login">Login</Link>
                            </Button>
                        </>
                    )}

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="h-8 w-8 sm:h-9 sm:w-9 cursor-pointer touch-manipulation active:opacity-70"
                        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                    >
                        {theme === "dark" ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
                    </Button>
                </div>
            </div>
        </header>
    )
}
