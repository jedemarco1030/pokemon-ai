"use client"

import { ArrowLeft, ChevronRight, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { PokemonDetails } from "@/types/pokemon"
import { useEffect } from "react"
import { useFavorites } from "@/hooks/use-favorites"
import { toast } from "sonner"
import { useAuth } from "@/components/auth-provider"

interface PokemonDetailsViewProps {
    pokemon: PokemonDetails
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

export function PokemonDetailsView({ pokemon }: PokemonDetailsViewProps) {
    const { user } = useAuth()
    const { toggleFavorite, isFavorited } = useFavorites(user)

    const handleFavoriteClick = async () => {
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

        await toggleFavorite(pokemon.id, pokemon.name)
    }

    const favorited = isFavorited(pokemon.id)

    return (
        <div className="min-h-screen pb-20">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <Link href="/">
                    <Button variant="ghost" className="mb-6">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Search
                    </Button>
                </Link>

                {/* Header Section */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <Card className="border-2">
                        <CardContent className="p-8">
                            <div className="relative aspect-square bg-secondary/50 rounded-lg overflow-hidden">
                                <Image
                                    src={pokemon.sprite || "/placeholder.svg"}
                                    alt={pokemon.name}
                                    fill
                                    className="object-contain p-4"
                                    unoptimized
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-4xl font-bold capitalize">{pokemon.name}</h1>
                                <span className="text-xl text-muted-foreground font-mono">
                  #{pokemon.id.toString().padStart(3, "0")}
                </span>
                                <button
                                    onClick={handleFavoriteClick}
                                    className={`ml-2 relative group ${!user ? "opacity-50 cursor-pointer" : "cursor-pointer hover:scale-110 transition-transform"}`}
                                    title={!user ? "Login to favorite Pokemon" : favorited ? "Remove from favorites" : "Add to favorites"}
                                >
                                    <Star
                                        className={`w-8 h-8 ${favorited ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                                    />
                                    {!user && (
                                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-popover text-popover-foreground text-xs rounded-md shadow-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border text-center">
                                            Login to favorite Pokemon
                                        </div>
                                    )}
                                </button>
                            </div>
                            <p className="text-muted-foreground text-lg">{pokemon.species.genus}</p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {pokemon.types.map((type) => (
                                <Badge
                                    key={type}
                                    className={`${typeColors[type] || "bg-gray-500"} text-white border-0 capitalize text-sm px-4 py-1`}
                                >
                                    {type}
                                </Badge>
                            ))}
                        </div>

                        <Card>
                            <CardContent className="p-6">
                                <p className="text-base leading-relaxed">{pokemon.species.flavorText}</p>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-2 gap-4">
                            <Card>
                                <CardContent className="p-4 text-center">
                                    <p className="text-sm text-muted-foreground mb-1">Height</p>
                                    <p className="text-2xl font-bold">{pokemon.height / 10}m</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4 text-center">
                                    <p className="text-sm text-muted-foreground mb-1">Weight</p>
                                    <p className="text-2xl font-bold">{pokemon.weight / 10}kg</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <Tabs defaultValue="stats" className="w-full">
                    <TabsList className="w-full justify-start">
                        <TabsTrigger value="stats">Stats</TabsTrigger>
                        <TabsTrigger value="evolutions">Evolutions</TabsTrigger>
                        <TabsTrigger value="moves">Moves</TabsTrigger>
                        <TabsTrigger value="info">Info</TabsTrigger>
                    </TabsList>

                    <TabsContent value="stats" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Base Stats</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {pokemon.stats.map((stat) => (
                                    <div key={stat.name} className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium capitalize">{stat.name.replace("-", " ")}</span>
                                            <span className="text-sm font-bold">{stat.value}</span>
                                        </div>
                                        <Progress value={(stat.value / stat.maxValue) * 100} className="h-2" />
                                    </div>
                                ))}
                                <div className="pt-4 border-t">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">Base Experience</span>
                                        <span className="text-sm font-bold">{pokemon.baseExperience}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Abilities</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {pokemon.abilities.map((ability) => (
                                        <Badge key={ability} variant="secondary" className="capitalize text-sm px-3 py-1">
                                            {ability.replace("-", " ")}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="evolutions" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Evolution Chain</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {pokemon.evolutionChain.length > 1 ? (
                                    <div className="flex flex-wrap items-center gap-4">
                                        {pokemon.evolutionChain.map((evolution, index) => (
                                            <div key={evolution.id} className="flex items-center">
                                                <Link href={`/pokemon/${evolution.id}`}>
                                                    <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                                                        <CardContent className="p-4">
                                                            <div className="relative w-32 h-32 mb-2">
                                                                <Image
                                                                    src={evolution.sprite || "/placeholder.svg"}
                                                                    alt={evolution.name}
                                                                    fill
                                                                    className="object-contain"
                                                                    unoptimized
                                                                />
                                                            </div>
                                                            <p className="text-center capitalize font-medium">{evolution.name}</p>
                                                            <p className="text-center text-xs text-muted-foreground">
                                                                #{evolution.id.toString().padStart(3, "0")}
                                                            </p>
                                                        </CardContent>
                                                    </Card>
                                                </Link>
                                                {index < pokemon.evolutionChain.length - 1 && (
                                                    <ChevronRight className="mx-2 h-8 w-8 text-muted-foreground" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground">This Pokemon does not evolve.</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="moves" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Moves (First 20)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {pokemon.moves.map((move, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 rounded-md bg-secondary/50">
                                            <span className="capitalize font-medium">{move.name.replace("-", " ")}</span>
                                            <div className="flex gap-2 items-center">
                                                <Badge variant="outline" className="capitalize">
                                                    {move.learnMethod.replace("-", " ")}
                                                </Badge>
                                                {move.level && <Badge variant="secondary">Lvl {move.level}</Badge>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="info" className="mt-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>General Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Generation</span>
                                        <span className="font-medium capitalize">{pokemon.species.generation.replace("-", " ")}</span>
                                    </div>
                                    {pokemon.species.habitat && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Habitat</span>
                                            <span className="font-medium capitalize">{pokemon.species.habitat}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Base Experience</span>
                                        <span className="font-medium">{pokemon.baseExperience} XP</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Capture Rate</span>
                                        <span className="font-medium">{pokemon.species.captureRate}/255</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Growth Rate</span>
                                        <span className="font-medium capitalize">{pokemon.species.growthRate.replace("-", " ")}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Gender Ratio</span>
                                        <span className="font-medium">
                                            {pokemon.species.genderRate === -1 ? (
                                                "Genderless"
                                            ) : (
                                                <>
                                                    <span className="text-blue-500">{(8 - pokemon.species.genderRate) * 12.5}% ♂</span>
                                                    {" / "}
                                                    <span className="text-pink-500">{pokemon.species.genderRate * 12.5}% ♀</span>
                                                </>
                                            )}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Additional Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-2">Held Items</p>
                                        <div className="flex flex-wrap gap-2">
                                            {pokemon.heldItems.length > 0 ? (
                                                pokemon.heldItems.map((item) => (
                                                    <Badge key={item} variant="outline" className="capitalize">
                                                        {item.replace("-", " ")}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <span className="text-sm text-muted-foreground">None</span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-2">Available in Games</p>
                                        <div className="flex flex-wrap gap-2">
                                            {pokemon.games.map((game) => (
                                                <Badge key={game} variant="secondary" className="capitalize">
                                                    {game.replace("-", " ")}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
