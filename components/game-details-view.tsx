"use client"

import { ArrowLeft, MapPin, Sparkles, Gamepad2, Info } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GameDetails } from "@/types/games"

interface GameDetailsViewProps {
    game: GameDetails
}

export function GameDetailsView({ game }: GameDetailsViewProps) {
    return (
        <div className="min-h-screen pb-20">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <Link href="/games">
                    <Button variant="ghost" className="mb-6">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Games
                    </Button>
                </Link>

                <header className="mb-8">
                    <div className="flex items-center gap-4 mb-2">
                        <h1 className="text-4xl font-bold capitalize">{game.name.replace(/-/g, " ")}</h1>
                        <Badge variant="outline" className="text-lg py-1 px-4">
                            {game.generation.name.replace(/-/g, " ")}
                        </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {game.versions.map(v => (
                            <Badge key={v.name} className="capitalize">{v.name.replace(/-/g, " ")}</Badge>
                        ))}
                    </div>
                </header>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="w-full justify-start">
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="pokemon">Pokemon</TabsTrigger>
                                <TabsTrigger value="locations">Locations</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="mt-6 space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Info className="h-5 w-5 text-primary" />
                                            Key Features & Story
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p>
                                            Explore the {game.regions.map(r => r.name).join(", ")} region(s) in this {game.generation.name.replace(/-/g, " ")} adventure.
                                        </p>
                                        <div className="grid sm:grid-cols-2 gap-4 pt-4">
                                            <div className="p-4 bg-secondary rounded-lg">
                                                <h4 className="font-bold mb-2 flex items-center gap-2">
                                                    <Sparkles className="h-4 w-4" />
                                                    Key Pokemon
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Discover a variety of Pokemon unique to this generation.
                                                </p>
                                            </div>
                                            <div className="p-4 bg-secondary rounded-lg">
                                                <h4 className="font-bold mb-2 flex items-center gap-2">
                                                    <Gamepad2 className="h-4 w-4" />
                                                    Gameplay
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Traditional turn-based battles and exploration that defined the series.
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5 text-primary" />
                                            Region Info
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {game.regions.map(region => (
                                                <div key={region.name} className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                                                    <span className="font-medium capitalize">{region.name}</span>
                                                    <Badge variant="outline">Main Region</Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="pokemon" className="mt-6">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {game.mainPokemon.map((poke) => (
                                        <Link href={`/pokemon/${poke.id}`} key={poke.id}>
                                            <Card className="hover:shadow-md transition-all cursor-pointer text-center">
                                                <CardContent className="p-4">
                                                    <div className="relative aspect-square mb-2">
                                                        <Image
                                                            src={poke.sprite || "/placeholder.svg"}
                                                            alt={poke.name}
                                                            fill
                                                            className="object-contain"
                                                            unoptimized
                                                        />
                                                    </div>
                                                    <p className="font-bold capitalize truncate">{poke.name}</p>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="locations" className="mt-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Key Towns & Routes</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid sm:grid-cols-2 gap-2">
                                            {game.locations.map(loc => (
                                                <div key={loc.name} className="flex items-center gap-2 p-2 bg-muted/30 rounded border capitalize text-sm">
                                                    <MapPin className="h-3 w-3 text-muted-foreground" />
                                                    {loc.name.replace(/-/g, " ")}
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Version Data</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Pokedexes</p>
                                    <div className="flex flex-wrap gap-2">
                                        {game.pokedexes.map(p => (
                                            <Badge key={p.name} variant="secondary" className="capitalize">
                                                {p.name.replace(/-/g, " ")}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Internal ID</p>
                                    <p className="font-mono text-lg">{game.id}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
