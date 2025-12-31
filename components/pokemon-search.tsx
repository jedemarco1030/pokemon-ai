"use client"

import { useState, useEffect } from "react"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PokemonList } from "@/components/pokemon-list"
import { usePokemonSearch } from "@/hooks/use-pokemon-search"
import { useFavorites } from "@/hooks/use-favorites"
import { useAuth } from "@/components/auth-provider"

export function PokemonSearch() {
    const [searchQuery, setSearchQuery] = useState("")
    const { pokemon, loading, error, searchPokemon, loadMore, hasMore } = usePokemonSearch()
    const { user } = useAuth()
    const { favorites, toggleFavorite, isFavorited } = useFavorites(user)

    useEffect(() => {
        const trimmedQuery = searchQuery.trim()

        if (trimmedQuery.length >= 3 || trimmedQuery.length === 0) {
            const debounceTimer = setTimeout(() => {
                searchPokemon(trimmedQuery)
            }, 300) // 300ms debounce

            return () => clearTimeout(debounceTimer)
        } else if (trimmedQuery.length > 0 && trimmedQuery.length < 3) {
            // Clear results if less than 3 characters
            searchPokemon(trimmedQuery)
        }
    }, [searchQuery])

    return (
        <div className="space-y-8">
            <div className="max-w-2xl mx-auto">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search for a Pokemon (min 3 characters)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 pr-4 h-14 text-lg border-2 focus-visible:ring-primary"
                    />
                </div>
                {searchQuery.length > 0 && searchQuery.length < 3 && (
                    <p className="text-sm text-muted-foreground mt-2 ml-1">Type at least 3 characters to search</p>
                )}
            </div>

            {loading && pokemon.length === 0 && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            )}

            {error && (
                <div className="text-center py-12">
                    <p className="text-destructive text-lg">{error}</p>
                </div>
            )}

            {!loading && pokemon.length === 0 && !error && (
                <div className="text-center py-20">
                    <p className="text-muted-foreground text-lg">
                        {searchQuery.length >= 3 ? "No Pokemon found. Try a different search!" : "Start typing to search Pokemon!"}
                    </p>
                </div>
            )}

            {pokemon.length > 0 && (
                <>
                    <PokemonList
                        pokemon={pokemon}
                        user={user}
                        favorites={favorites}
                        onToggleFavorite={toggleFavorite}
                        isFavorited={isFavorited}
                    />

                    {hasMore && (
                        <div className="flex justify-center pt-8">
                            <Button onClick={loadMore} disabled={loading} size="lg" className="min-w-[200px]">
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        {"Loading..."}
                                    </>
                                ) : (
                                    "Load More"
                                )}
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
