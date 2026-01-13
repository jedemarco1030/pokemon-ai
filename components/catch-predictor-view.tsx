"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { calculateCatchProbability } from "@/app/actions/catch-predictor"
import { PokemonSearchModal } from "@/components/pokemon-search-modal"
import { Loader2, Target, Heart, Zap, Sparkles } from "lucide-react"
import Image from "next/image"

interface SelectedPokemon {
    id: number
    name: string
    sprite: string
    captureRate: number
}

export function CatchPredictorView({ initialPokemonId }: { initialPokemonId?: number }) {
    const [selectedPokemon, setSelectedPokemon] = useState<SelectedPokemon | null>(null)
    const [hpPercentage, setHpPercentage] = useState(100)
    const [statusCondition, setStatusCondition] = useState("none")
    const [ballType, setBallType] = useState("poke-ball")
    const [isCalculating, setIsCalculating] = useState(false)
    const [result, setResult] = useState<{ probability: number, insight: string } | null>(null)
    const [searchModalOpen, setSearchModalOpen] = useState(false)

    useEffect(() => {
        if (initialPokemonId) {
            fetchPokemonDetails(initialPokemonId)
        }
    }, [initialPokemonId])

    const fetchPokemonDetails = async (id: number) => {
        setIsCalculating(true)
        try {
            const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
            const speciesData = await speciesRes.json()

            const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            const pokemonData = await pokemonRes.json()

            setSelectedPokemon({
                id: id,
                name: pokemonData.name,
                sprite: pokemonData.sprites.other["official-artwork"].front_default || pokemonData.sprites.front_default,
                captureRate: speciesData.capture_rate
            })
            setResult(null)
        } catch (error) {
            console.error("Error fetching pokemon details:", error)
        } finally {
            setIsCalculating(false)
        }
    }

    const handleSelectPokemon = (pokemon: { id: number, name: string, sprite: string }) => {
        fetchPokemonDetails(pokemon.id)
        setSearchModalOpen(false)
    }

    const handlePredict = async () => {
        if (!selectedPokemon) return

        setIsCalculating(true)
        const prediction = await calculateCatchProbability(
            selectedPokemon.id,
            hpPercentage,
            statusCondition,
            ballType,
            selectedPokemon.captureRate
        )

        if (prediction && 'probability' in prediction) {
            setResult({
                probability: prediction.probability as number,
                insight: prediction.insight as string
            })
        }
        setIsCalculating(false)
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Catch Probability Predictor
                </h1>
                <p className="text-muted-foreground">
                    Estimate your chances of catching a Pokémon based on its health, status, and the Poké Ball used.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Target className="w-5 h-5 text-primary" />
                                Target Pokémon
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {selectedPokemon ? (
                                <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
                                    <div className="relative w-20 h-20 bg-background rounded-md">
                                        <Image
                                            src={selectedPokemon.sprite}
                                            alt={selectedPokemon.name}
                                            fill
                                            className="object-contain p-2"
                                            unoptimized
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold capitalize">{selectedPokemon.name}</h3>
                                        <p className="text-sm text-muted-foreground">Base Capture Rate: {selectedPokemon.captureRate}/255</p>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => setSearchModalOpen(true)}>
                                        Change
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    variant="outline"
                                    className="w-full h-24 border-dashed flex flex-col gap-2"
                                    onClick={() => setSearchModalOpen(true)}
                                >
                                    <Target className="w-6 h-6 text-muted-foreground" />
                                    Select a Pokémon
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Heart className="w-5 h-5 text-destructive" />
                                Battle State
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <Label>Remaining HP: {hpPercentage}%</Label>
                                </div>
                                <Slider
                                    value={[hpPercentage]}
                                    onValueChange={(vals) => setHpPercentage(vals[0])}
                                    max={100}
                                    min={1}
                                    step={1}
                                    className="py-4"
                                />
                                <div className="flex justify-between text-[10px] text-muted-foreground">
                                    <span>Critical</span>
                                    <span>Half</span>
                                    <span>Full</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Status Condition</Label>
                                <Select value={statusCondition} onValueChange={setStatusCondition}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None</SelectItem>
                                        <SelectItem value="sleep">Sleep / Freeze</SelectItem>
                                        <SelectItem value="paralysis">Paralysis / Poison / Burn</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Poké Ball Type</Label>
                                <Select value={ballType} onValueChange={setBallType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select ball" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="poke-ball">Poké Ball</SelectItem>
                                        <SelectItem value="great-ball">Great Ball</SelectItem>
                                        <SelectItem value="ultra-ball">Ultra Ball</SelectItem>
                                        <SelectItem value="master-ball">Master Ball</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                className="w-full gap-2"
                                disabled={!selectedPokemon || isCalculating}
                                onClick={handlePredict}
                            >
                                {isCalculating ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Zap className="w-4 h-4" />
                                )}
                                Predict Catch Chance
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="h-full flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Sparkles className="w-5 h-5 text-accent" />
                                Result & Analysis
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col justify-center items-center text-center p-8">
                            {result ? (
                                <div className="space-y-6 w-full animate-in fade-in zoom-in duration-300">
                                    <div className="relative inline-flex items-center justify-center">
                                        <svg className="w-48 h-48 transform -rotate-90">
                                            <circle
                                                cx="96"
                                                cy="96"
                                                r="88"
                                                stroke="currentColor"
                                                strokeWidth="12"
                                                fill="transparent"
                                                className="text-secondary"
                                            />
                                            <circle
                                                cx="96"
                                                cy="96"
                                                r="88"
                                                stroke="currentColor"
                                                strokeWidth="12"
                                                fill="transparent"
                                                strokeDasharray={552.92}
                                                strokeDashoffset={552.92 - (552.92 * result.probability) / 100}
                                                className="text-primary transition-all duration-1000 ease-out"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-4xl font-bold">{result.probability}%</span>
                                            <span className="text-xs text-muted-foreground uppercase tracking-widest">Chance</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-lg">{result.insight}</h4>
                                        <p className="text-sm text-muted-foreground">
                                            This calculation uses the standard catch rate formula modified for modern games.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-left">
                                        <div className="bg-secondary/50 p-3 rounded-md">
                                            <p className="text-[10px] text-muted-foreground uppercase">Ball Modifier</p>
                                            <p className="font-medium">
                                                {ballType === "poke-ball" ? "1.0x" :
                                                 ballType === "great-ball" ? "1.5x" :
                                                 ballType === "ultra-ball" ? "2.0x" : "MAX"}
                                            </p>
                                        </div>
                                        <div className="bg-secondary/50 p-3 rounded-md">
                                            <p className="text-[10px] text-muted-foreground uppercase">Status Modifier</p>
                                            <p className="font-medium">
                                                {statusCondition === "none" ? "1.0x" :
                                                 statusCondition === "sleep" ? "2.0x" : "1.5x"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto">
                                        <Target className="w-10 h-10 text-muted-foreground opacity-20" />
                                    </div>
                                    <div className="max-w-[200px]">
                                        <p className="text-muted-foreground">
                                            Select a Pokémon and adjust the battle parameters to see your results.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <PokemonSearchModal
                open={searchModalOpen}
                onOpenChange={setSearchModalOpen}
                onSelect={handleSelectPokemon}
            />
        </div>
    )
}
