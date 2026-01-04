"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { toast } from "sonner"
import type { Pokemon } from "@/types/pokemon"
import type { User } from "@supabase/supabase-js"

interface PokemonCardProps {
    pokemon: Pokemon
    user: User | null
    isFavorited?: boolean
    onToggleFavorite?: (pokemonId: number, pokemonName: string) => void
}

const typeColors: Record<string, string> = {
    normal: "bg-gray-400",
    fire: "bg-orange-500",
    water: "bg-blue-500",
    electric: "bg-yellow-400",
    grass: "bg-green-500",
    ice: "bg-cyan-400",
    fighting: "bg-red-600",
    poison: "bg-purple-500",
    ground: "bg-amber-600",
    flying: "bg-indigo-400",
    psychic: "bg-pink-500",
    bug: "bg-lime-500",
    rock: "bg-stone-600",
    ghost: "bg-violet-600",
    dragon: "bg-indigo-600",
    dark: "bg-gray-700",
    steel: "bg-slate-500",
    fairy: "bg-pink-400",
}

export function PokemonCard({ pokemon, user, isFavorited = false, onToggleFavorite }: PokemonCardProps) {
    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault()
        console.log("[v0] Star clicked", { user: !!user, pokemon: pokemon.name, id: pokemon.id })
        if (!user) {
            toast.error("Please login to favorite a Pokemon", {
                description: "You need to be signed in to keep track of your favorites.",
                action: {
                    label: "Login",
                    onClick: () => (window.location.href = "/login"),
                },
            })
            return
        }

        if (onToggleFavorite) {
            console.log("[v0] Calling onToggleFavorite")
            onToggleFavorite(pokemon.id, pokemon.name)
        }
    }

    return (
        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl capitalize">{pokemon.name}</CardTitle>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground font-mono">#{pokemon.id.toString().padStart(3, "0")}</span>
                        <button
                            onClick={handleFavoriteClick}
                            className={`relative group ${!user ? "opacity-50 cursor-pointer" : "cursor-pointer hover:scale-110 transition-transform"}`}
                            title={!user ? "Login to favorite Pokemon" : isFavorited ? "Remove from favorites" : "Add to favorites"}
                        >
                            <Star
                                className={`w-6 h-6 ${isFavorited ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                            />
                            {!user && (
                                <div className="absolute bottom-full mb-2 right-0 w-48 bg-popover text-popover-foreground text-xs rounded-md shadow-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border">
                                    Login to favorite Pokemon
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="relative aspect-square bg-secondary/50 rounded-lg overflow-hidden">
                    <Image
                        src={pokemon.sprite || "/placeholder.svg"}
                        alt={pokemon.name}
                        fill
                        className="object-contain p-4"
                        unoptimized
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    {pokemon.types.map((type) => (
                        <Badge key={type} className={`${typeColors[type] || "bg-gray-500"} text-white border-0 capitalize`}>
                            {type}
                        </Badge>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="text-center p-2 bg-secondary rounded-md">
                        <p className="text-xs text-muted-foreground mb-1">{"Height"}</p>
                        <p className="font-semibold">{pokemon.height / 10}m</p>
                    </div>
                    <div className="text-center p-2 bg-secondary rounded-md">
                        <p className="text-xs text-muted-foreground mb-1">{"Weight"}</p>
                        <p className="font-semibold">{pokemon.weight / 10}kg</p>
                    </div>
                </div>

                <Button asChild className="w-full" variant="default">
                    <Link href={`/pokemon/${pokemon.id}`}>
                        View Details
                    </Link>
                </Button>
            </CardContent>
        </Card>
    )
}
