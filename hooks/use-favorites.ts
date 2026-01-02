"use client"

import { useState, useEffect, useCallback } from "react"
// import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { getFavorites, toggleFavoriteAction } from "@/app/actions/pokemon"

export function useFavorites(user: User | null) {
    const [favorites, setFavorites] = useState<Set<number>>(new Set())
    const [isLoading, setIsLoading] = useState(true)

    const loadFavorites = useCallback(async () => {
        if (!user) return
        try {
            const favoriteIds = await getFavorites(user.id)
            setFavorites(new Set(favoriteIds))
        } catch (error) {
            console.error("Error loading favorites:", error)
        } finally {
            setIsLoading(false)
        }
    }, [user])

    useEffect(() => {
        if (user) {
            loadFavorites()
        } else {
            setFavorites(new Set())
            setIsLoading(false)
        }
    }, [user, loadFavorites])

    async function toggleFavorite(pokemonId: number, pokemonName: string) {
        if (!user) {
            return
        }

        const isCurrentlyFavorited = favorites.has(pokemonId)

        try {
            // Optimistic update
            setFavorites((prev) => {
                const next = new Set(prev)
                if (isCurrentlyFavorited) {
                    next.delete(pokemonId)
                } else {
                    next.add(pokemonId)
                }
                return next
            })

            const result = await toggleFavoriteAction(user.id, pokemonId, pokemonName)
            if (!result.success) {
                // Rollback on failure
                setFavorites((prev) => {
                    const next = new Set(prev)
                    if (isCurrentlyFavorited) {
                        next.add(pokemonId)
                    } else {
                        next.delete(pokemonId)
                    }
                    return next
                })
            }
        } catch (error) {
            console.error("Error toggling favorite:", error)
        }
    }

    return {
        favorites,
        isLoading,
        toggleFavorite,
        isFavorited: (pokemonId: number) => favorites.has(pokemonId),
        refreshFavorites: loadFavorites,
    }
}
