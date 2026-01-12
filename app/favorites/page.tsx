"use client"

import { useEffect, useState, useCallback } from "react"
import { PokemonCard } from "@/components/pokemon-card"
import type { Pokemon } from "@/types/pokemon"
import { useFavorites } from "@/hooks/use-favorites"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { Loader2 } from "lucide-react"

export default function FavoritesPage() {
    const { user, loading: authLoading } = useAuth()
    const [favoritePokemon, setFavoritePokemon] = useState<Pokemon[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const { favorites, toggleFavorite, isFavorited, isLoading: favoritesLoading, isToggleLoading } = useFavorites(user)

    const loadFavoritePokemon = useCallback(async () => {
        setIsLoading(true)
        try {
            const pokemonPromises = Array.from(favorites).map(async (pokemonId) => {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
                const data = await response.json()
                return {
                    id: data.id,
                    name: data.name,
                    height: data.height,
                    weight: data.weight,
                    sprite: data.sprites.other["official-artwork"].front_default || data.sprites.front_default,
                    types: data.types.map((t: { type: { name: string } }) => t.type.name),
                }
            })

            const pokemon = await Promise.all(pokemonPromises)
            setFavoritePokemon(pokemon)
        } catch (error) {
            console.error("Error loading favorite Pokemon:", error)
        } finally {
            setIsLoading(false)
        }
    }, [favorites])

    useEffect(() => {
        if (user && favorites.size > 0) {
            loadFavoritePokemon()
        } else if (!favoritesLoading) {
            setFavoritePokemon([])
            setIsLoading(false)
        }
    }, [user, favorites, loadFavoritePokemon, favoritesLoading])

    if (authLoading || favoritesLoading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="h-96 rounded-2xl bg-card/50 animate-pulse border border-border/50 backdrop-blur-sm"
                        />
                    ))}
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-md mx-auto text-center space-y-6">
                    <h1 className="text-4xl font-bold">Favorites</h1>
                    <p className="text-muted-foreground">Please log in to view your favorite Pokemon.</p>
                    <Button asChild>
                        <Link href="/login">Login</Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        My Favorites
                    </h1>
                    <p className="text-muted-foreground">
                        {favorites.size === 0 ? "You haven't added any favorites yet." : `${favorites.size} Pokemon`}
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground italic">Fetching your favorite Pokemon...</p>
                    </div>
                ) : favorites.size === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">Start exploring and add your favorite Pokemon!</p>
                        <Button asChild>
                            <Link href="/">Browse Pokemon</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {favoritePokemon.map((pokemon) => (
                            <PokemonCard
                                key={pokemon.id}
                                pokemon={pokemon}
                                user={user}
                                isFavorited={true}
                                onToggleFavorite={toggleFavorite}
                                isToggleLoading={isToggleLoading(pokemon.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
