"use client"

import { useState, useEffect, useCallback } from "react"
import type { User } from "@supabase/supabase-js"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2, RefreshCw } from "lucide-react"
import { getPersonalizedRecommendations } from "@/app/actions/recommendations"
import { PokemonCard } from "@/components/pokemon-card"
import { useFavorites } from "@/hooks/use-favorites"
import type { Pokemon } from "@/types/pokemon"
import Link from "next/link"

export function RecommendationsView({ user }: { user: User }) {
    const [recommendations, setRecommendations] = useState<Pokemon[]>([])
    const [insight, setInsight] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const { toggleFavorite, isFavorited } = useFavorites(user)

    const fetchRecommendations = useCallback(async () => {
        setIsLoading(true)
        try {
            const result = await getPersonalizedRecommendations(user.id)
            if (result.success) {
                setRecommendations(result.recommendations || [])
                setInsight(result.insight || null)
            }
        } catch (error) {
            console.error("Error fetching recommendations:", error)
        } finally {
            setIsLoading(false)
        }
    }, [user.id])

    useEffect(() => {
        fetchRecommendations()
    }, [fetchRecommendations])

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        AI Recommendations
                    </h1>
                    <p className="text-muted-foreground">
                        Personalized suggestions based on your favorites.
                    </p>
                </div>
                <Button
                    onClick={fetchRecommendations}
                    disabled={isLoading}
                    variant="outline"
                    className="gap-2"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    Refresh Recommendations
                </Button>
            </div>

            {insight && (
                <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-6 flex items-start gap-4">
                        <div className="bg-primary/10 p-2 rounded-lg">
                            <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-1">AI Insight</h3>
                            <p className="text-muted-foreground">{insight}</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="h-96 rounded-2xl bg-card/50 animate-pulse border border-border/50 backdrop-blur-sm"
                        />
                    ))}
                </div>
            ) : recommendations.length === 0 ? (
                <Card className="border-dashed py-20">
                    <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
                        <p className="text-muted-foreground text-lg">
                            You don&apos;t have enough favorites yet for us to make good recommendations.
                        </p>
                        <Button asChild>
                            <Link href="/">Browse and Favorite Pokemon</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {recommendations.map((pokemon) => (
                        <PokemonCard
                            key={pokemon.id}
                            pokemon={pokemon}
                            user={user}
                            isFavorited={isFavorited(pokemon.id)}
                            onToggleFavorite={toggleFavorite}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
