"use client"

import { useState } from "react"
import { Search, Loader2, Sparkles, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PokemonList } from "@/components/pokemon-list"
import { useFavorites } from "@/hooks/use-favorites"
import { useAuth } from "@/components/auth-provider"
import { processNaturalLanguageSearch } from "@/app/actions/semantic-search"
import type { Pokemon } from "@/types/pokemon"

export function SemanticSearchView() {
    const [query, setQuery] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [results, setResults] = useState<Pokemon[]>([])
    const [filters, setFilters] = useState<{
        types?: string[],
        generation?: number,
        color?: string,
        habitat?: string,
        isLegendary?: boolean,
        isMythical?: boolean
    } | null>(null)
    const [error, setError] = useState<string | null>(null)
    const { user } = useAuth()
    const { favorites, toggleFavorite, isFavorited } = useFavorites(user)

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!query.trim()) return

        setIsLoading(true)
        setError(null)
        try {
            const response = await processNaturalLanguageSearch(query)
            if (response.success && response.pokemonIds) {
                setFilters(response.filters)

                if (response.pokemonIds.length === 0) {
                    setResults([])
                    setError("No Pokemon found matching your description.")
                } else {
                    const pokemonPromises = response.pokemonIds.map(async (id: number) => {
                        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
                        const data = await res.json()
                        return {
                            id: data.id,
                            name: data.name,
                            height: data.height,
                            weight: data.weight,
                            sprite: data.sprites.other["official-artwork"].front_default || data.sprites.front_default,
                            types: data.types.map((t: { type: { name: string } }) => t.type.name),
                        }
                    })
                    const fetchedPokemon = await Promise.all(pokemonPromises)
                    setResults(fetchedPokemon)
                }
            } else {
                setError(response.error || "Something went wrong.")
            }
        } catch (err) {
            console.error(err)
            setError("Failed to perform semantic search.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-8">
            <div className="max-w-3xl mx-auto space-y-4">
                <Card className="border-2 border-primary/20 bg-primary/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-primary">
                            <Sparkles className="h-5 w-5" />
                            AI-Powered Semantic Search
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="e.g., 'Blue water pokemon from Gen 1' or 'Legendary fire types'..."
                                    className="pl-12 h-12 text-lg focus-visible:ring-primary border-primary/30"
                                />
                            </div>
                            <Button type="submit" disabled={isLoading} size="lg" className="h-12 px-8">
                                {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Search"}
                            </Button>
                        </form>
                        <div className="mt-4 flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
                            <span>Try:</span>
                            <button onClick={() => setQuery("Red dragon pokemon")} className="hover:text-primary transition-colors underline-offset-4 hover:underline">&quot;Red dragon pokemon&quot;</button>
                            <button onClick={() => setQuery("Gen 1 water types")} className="hover:text-primary transition-colors underline-offset-4 hover:underline">&quot;Gen 1 water types&quot;</button>
                            <button onClick={() => setQuery("Legendary grass types")} className="hover:text-primary transition-colors underline-offset-4 hover:underline">&quot;Legendary grass types&quot;</button>
                        </div>
                    </CardContent>
                </Card>

                {filters && (
                    <div className="flex flex-wrap gap-2 items-center bg-secondary/50 p-3 rounded-lg border">
                        <span className="text-sm font-medium flex items-center gap-1">
                            <Filter className="h-4 w-4" /> AI Interpretation:
                        </span>
                        {filters.types?.map((t: string) => (
                            <Badge key={t} variant="outline" className="capitalize">{t}</Badge>
                        ))}
                        {filters.generation && <Badge variant="outline">Gen {filters.generation}</Badge>}
                        {filters.color && <Badge variant="outline" className="capitalize">{filters.color}</Badge>}
                        {filters.habitat && <Badge variant="outline" className="capitalize">{filters.habitat}</Badge>}
                        {filters.isLegendary && <Badge variant="outline">Legendary</Badge>}
                        {filters.isMythical && <Badge variant="outline">Mythical</Badge>}
                    </div>
                )}
            </div>

            {error && (
                <div className="text-center py-12">
                    <p className="text-destructive text-lg">{error}</p>
                </div>
            )}

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground animate-pulse text-lg font-medium">AI is scouring the Pokedex...</p>
                </div>
            ) : results.length > 0 ? (
                <div className="space-y-6">
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                        Search Results
                        <Badge variant="secondary">{results.length}</Badge>
                    </h3>
                    <PokemonList
                        pokemon={results}
                        user={user}
                        favorites={favorites}
                        onToggleFavorite={toggleFavorite}
                        isFavorited={isFavorited}
                    />
                </div>
            ) : null}
        </div>
    )
}
