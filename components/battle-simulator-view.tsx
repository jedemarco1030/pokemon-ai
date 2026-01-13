"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import type { User } from "@supabase/supabase-js"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Swords, Zap, Sparkles, RefreshCcw, Trophy, AlertTriangle, ChevronLeft, Loader2 } from "lucide-react"
import { getTeams } from "@/app/actions/teams"
import { getBattleAdvice } from "@/app/actions/battle"
import { BattleState, BattlePokemon, BattleAdvice } from "@/types/battle"
import { GYM_LEADERS, GymLeaderPersona } from "@/lib/battle/personas"
import { getEffectiveness, calculateDamage } from "@/lib/battle/utils"
import Image from "next/image"
import { toast } from "sonner"

interface Team {
    id: string
    name: string
    members: { pokemon_id: number; pokemon_name: string; slot: number }[]
}

// const typeColors: Record<string, string> = { ... }

export function BattleSimulatorView({ user }: { user: User }) {
    const [savedTeams, setSavedTeams] = useState<Team[]>([])
    const [isLoadingTeams, setIsLoadingTeams] = useState(true)
    const [battleState, setBattleState] = useState<BattleState | null>(null)
    const [isStarting, setIsStarting] = useState(false)
    const [advice, setAdvice] = useState<BattleAdvice | null>(null)
    const [isLoadingAdvice, setIsLoadingAdvice] = useState(false)
    const [mode, setMode] = useState<"select-team" | "select-opponent" | "battle">("select-team")
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
    const scrollRef = useRef<HTMLDivElement>(null)

    const fetchTeams = useCallback(async () => {
        setIsLoadingTeams(true)
        const teams = await getTeams(user.id)
        setSavedTeams(teams)
        setIsLoadingTeams(false)
    }, [user.id])

    useEffect(() => {
        fetchTeams()
    }, [fetchTeams])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [battleState?.log])

    const fetchPokemonDetails = async (id: number): Promise<BattlePokemon> => {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        const data = await res.json()

        const hpStat = data.stats.find((s: { stat: { name: string }, base_stat: number }) => s.stat.name === "hp")?.base_stat || 100
        const maxHp = hpStat * 2 + 100 // Simple formula for max HP at "level 50"

        return {
            id: data.id,
            name: data.name,
            height: data.height,
            weight: data.weight,
            sprite: data.sprites.other["official-artwork"].front_default || data.sprites.front_default,
            types: data.types.map((t: { type: { name: string } }) => t.type.name),
            stats: data.stats.map((s: { stat: { name: string }, base_stat: number }) => ({
                name: s.stat.name,
                value: s.base_stat,
                maxValue: 255,
            })),
            abilities: data.abilities.map((a: { ability: { name: string } }) => a.ability.name),
            baseExperience: data.base_experience,
            species: {
                flavorText: "",
                genus: "",
                habitat: null,
                generation: "",
                captureRate: 0,
                genderRate: 0,
                growthRate: "",
            },
            heldItems: [],
            evolutionChain: [],
            moves: data.moves.slice(0, 4).map((m: { move: { name: string } }) => ({
                name: m.move.name,
                learnMethod: "level-up"
            })),
            games: [],
            currentHp: maxHp,
            maxHp: maxHp,
            statusEffects: []
        }
    }

    const startBattle = async (team: Team, persona?: GymLeaderPersona) => {
        if (team.members.length === 0) {
            toast.error("This team has no members!")
            return
        }

        setIsStarting(true)
        try {
            // Load player team details
            const playerTeam = await Promise.all(team.members.map(m => fetchPokemonDetails(m.pokemon_id)))

            // Generate opponent team
            let opponentTeam: BattlePokemon[]
            if (persona) {
                opponentTeam = await Promise.all(persona.team.map(id => fetchPokemonDetails(id)))
            } else {
                // Generate random opponent team (3-6 pokemon)
                const opponentSize = Math.max(3, team.members.length)
                const opponentIds = Array.from({ length: opponentSize }, () => Math.floor(Math.random() * 800) + 1)
                opponentTeam = await Promise.all(opponentIds.map(id => fetchPokemonDetails(id)))
            }

            const initialState: BattleState = {
                playerTeam,
                opponentTeam,
                activePlayerIndex: 0,
                activeOpponentIndex: 0,
                log: ["Battle started!", `${persona ? `Gym Leader ${persona.name}` : 'Opponent'} sent out ${opponentTeam[0].name}!`, `Go, ${playerTeam[0].name}!`],
                turn: 1,
                isFinished: false,
                winner: null,
                personaId: persona?.id
            }

            setBattleState(initialState)
            setMode("battle")
            getAIAdvice(initialState)
        } catch (error) {
            console.error("Error starting battle:", error)
            toast.error("Failed to initialize battle")
        } finally {
            setIsStarting(false)
        }
    }

    const getAIAdvice = async (state: BattleState) => {
        setIsLoadingAdvice(true)
        const result = await getBattleAdvice(state)
        if (result.success) {
            setAdvice(result.advice)
        }
        setIsLoadingAdvice(false)
    }

    const handleMove = async (moveName: string) => {
        if (!battleState || battleState.isFinished) return

        const newState = { ...battleState }
        const playerPokemon = newState.playerTeam[newState.activePlayerIndex]
        const opponentPokemon = newState.opponentTeam[newState.activeOpponentIndex]

        // 1. Player Turn
        const log = [...newState.log]
        log.push(`${playerPokemon.name} used ${moveName.replace("-", " ")}!`)

        // Improved damage calculation
        const playerAtk = playerPokemon.stats.find(s => s.name === "attack")?.value || 50
        const opponentDef = opponentPokemon.stats.find(s => s.name === "defense")?.value || 50
        
        // Mock move type (assume first type of pokemon for simplicity)
        const playerMoveType = playerPokemon.types[0]
        const playerEffectiveness = getEffectiveness(playerMoveType, opponentPokemon.types)
        const playerDamage = calculateDamage(playerAtk, opponentDef, 60, playerEffectiveness)

        opponentPokemon.currentHp = Math.max(0, opponentPokemon.currentHp - playerDamage)
        
        if (playerEffectiveness > 1) log.push("It's super effective!")
        if (playerEffectiveness < 1 && playerEffectiveness > 0) log.push("It's not very effective...")
        if (playerEffectiveness === 0) log.push(`It had no effect on ${opponentPokemon.name}...`)
        
        log.push(`It dealt ${playerDamage} damage to ${opponentPokemon.name}!`)

        if (opponentPokemon.currentHp === 0) {
            log.push(`${opponentPokemon.name} fainted!`)
            if (newState.activeOpponentIndex < newState.opponentTeam.length - 1) {
                newState.activeOpponentIndex++
                log.push(`Opponent sent out ${newState.opponentTeam[newState.activeOpponentIndex].name}!`)
            } else {
                newState.isFinished = true
                newState.winner = "player"
                log.push("You defeated the opponent!")
            }
        } else {
            // 2. Opponent Turn (if not fainted)
            // AI Move Selection: Choose the best move based on type effectiveness
            let bestMove = opponentPokemon.moves[0]
            let bestEff = 0
            
            opponentPokemon.moves.forEach(m => {
                // Mock move type (assume pokemon's type)
                const eff = getEffectiveness(opponentPokemon.types[0], playerPokemon.types)
                if (eff > bestEff) {
                    bestEff = eff
                    bestMove = m
                }
            })

            const opponentMove = bestMove.name
            log.push(`${opponentPokemon.name} used ${opponentMove.replace("-", " ")}!`)

            const opponentAtk = opponentPokemon.stats.find(s => s.name === "attack")?.value || 50
            const playerDef = playerPokemon.stats.find(s => s.name === "defense")?.value || 50
            
            const opponentEffectiveness = getEffectiveness(opponentPokemon.types[0], playerPokemon.types)
            const oppDamage = calculateDamage(opponentAtk, playerDef, 60, opponentEffectiveness)

            playerPokemon.currentHp = Math.max(0, playerPokemon.currentHp - oppDamage)
            
            if (opponentEffectiveness > 1) log.push("It's super effective!")
            if (opponentEffectiveness < 1 && opponentEffectiveness > 0) log.push("It's not very effective...")
            if (opponentEffectiveness === 0) log.push(`It had no effect on ${playerPokemon.name}...`)
            
            log.push(`It dealt ${oppDamage} damage to ${playerPokemon.name}!`)

            if (playerPokemon.currentHp === 0) {
                log.push(`${playerPokemon.name} fainted!`)
                if (newState.activePlayerIndex < newState.playerTeam.length - 1) {
                    newState.activePlayerIndex++
                    log.push(`Go, ${newState.playerTeam[newState.activePlayerIndex].name}!`)
                } else {
                    newState.isFinished = true
                    newState.winner = "opponent"
                    log.push("You were defeated by the opponent...")
                }
            }
        }

        newState.log = log
        newState.turn++
        setBattleState(newState)

        getAIAdvice(newState)
    }

    if (mode === "select-team") {
        return (
            <div className="space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        AI Battle Simulator
                    </h1>
                    <p className="text-muted-foreground">Select a team and test your strategy against AI opponents.</p>
                </div>

                {isLoadingTeams ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    </div>
                ) : savedTeams.length === 0 ? (
                    <Card className="max-w-md mx-auto">
                        <CardContent className="p-8 text-center space-y-4">
                            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto" />
                            <p className="text-muted-foreground">You don&apos;t have any teams yet.</p>
                            <Button asChild>
                                <a href="/team-builder">Go to Team Builder</a>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedTeams.map((team) => (
                            <Card key={team.id} className="hover:border-primary transition-colors overflow-hidden">
                                <CardHeader className="bg-muted/50">
                                    <CardTitle>{team.name}</CardTitle>
                                    <CardDescription>{team.members.length} Pokémon</CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 space-y-4">
                                    <div className="flex -space-x-4 overflow-hidden py-2">
                                        {team.members.map((m, i) => (
                                            <div key={i} className="relative w-12 h-12 bg-secondary rounded-full border-2 border-background overflow-hidden shadow-sm">
                                                <Image
                                                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${m.pokemon_id}.png`}
                                                    alt={m.pokemon_name}
                                                    fill
                                                    className="object-contain p-1"
                                                    unoptimized
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <Button className="w-full" onClick={() => {
                                        setSelectedTeam(team)
                                        setMode("select-opponent")
                                    }} disabled={isStarting}>
                                        {isStarting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Swords className="mr-2 h-4 w-4" />}
                                        Select Team
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        )
    }

    if (mode === "select-opponent") {
        return (
            <div className="space-y-8">
                <Button variant="ghost" onClick={() => setMode("select-team")} className="gap-2">
                    <ChevronLeft className="w-4 h-4" />
                    Change Team
                </Button>

                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold">Choose Your Opponent</h1>
                    <p className="text-muted-foreground">Select who you want to battle with {selectedTeam?.name}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    <Card
                        className="hover:border-primary transition-all cursor-pointer overflow-hidden group"
                        onClick={() => selectedTeam && startBattle(selectedTeam)}
                    >
                        <div className="h-48 bg-muted flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                            <Swords className="w-16 h-16 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <CardHeader>
                            <CardTitle>Random Trainer</CardTitle>
                            <CardDescription>Battle a random team of comparable size.</CardDescription>
                        </CardHeader>
                    </Card>

                    {GYM_LEADERS.map((leader) => (
                        <Card
                            key={leader.id}
                            className="hover:border-primary transition-all cursor-pointer overflow-hidden group"
                            onClick={() => selectedTeam && startBattle(selectedTeam, leader)}
                        >
                            <div className="h-48 bg-muted flex flex-col items-center justify-center group-hover:bg-primary/5 transition-colors p-4 text-center">
                                <Trophy className="w-12 h-12 text-yellow-500 mb-2" />
                                <h3 className="text-xl font-bold">{leader.name}</h3>
                                <p className="text-sm text-muted-foreground">{leader.title}</p>
                            </div>
                            <CardHeader>
                                <CardTitle className="text-lg">Gym Leader {leader.name}</CardTitle>
                                <CardDescription>Specialty: {leader.specialty}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-muted-foreground italic">&quot;{leader.strategy}&quot;</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {isStarting && (
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-12 h-12 animate-spin text-primary" />
                        <p className="text-xl font-medium animate-pulse">Initializing Battle Arena...</p>
                    </div>
                )}
            </div>
        )
    }

    if (mode !== "battle" || !battleState) return null

    const playerActive = battleState.playerTeam[battleState.activePlayerIndex]
    const opponentActive = battleState.opponentTeam[battleState.activeOpponentIndex]
    const persona = battleState.personaId ? GYM_LEADERS.find(p => p.id === battleState.personaId) : null

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => {
                    setBattleState(null)
                    setMode("select-team")
                }}>
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Quit Battle
                </Button>
                <div className="flex items-center gap-4">
                    <div className="text-xl font-bold">Turn {battleState.turn}</div>
                    {persona && (
                        <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white border-0">
                            Gym Battle: {persona.name}
                        </Badge>
                    )}
                </div>
                {battleState.isFinished && (
                    <Badge variant={battleState.winner === "player" ? "default" : "destructive"} className="text-lg px-4 py-1">
                        {battleState.winner === "player" ? <Trophy className="mr-2 h-4 w-4" /> : null}
                        {battleState.winner === "player" ? "Victory!" : "Defeat"}
                    </Badge>
                )}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Battle Field */}
                <Card className="lg:col-span-2 overflow-hidden bg-gradient-to-b from-blue-500/10 to-green-500/10 border-2">
                    <CardContent className="p-8 space-y-12">
                        {/* Opponent Side */}
                        <div className="flex flex-col items-end space-y-2 relative">
                            {persona && advice?.personaDialogue && (
                                <div className="absolute -left-4 w-64 -top-20 bg-card border-2 border-primary p-4 rounded-2xl rounded-br-none shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 z-10">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="outline" className="text-[10px] h-4 px-1 uppercase tracking-wider font-bold border-primary text-primary">
                                            {persona.name}
                                        </Badge>
                                    </div>
                                    <p className="text-sm font-medium leading-tight italic">&quot;{advice.personaDialogue}&quot;</p>
                                    <div className="absolute -bottom-2 right-4 w-4 h-4 bg-card border-b-2 border-r-2 border-primary rotate-45" />
                                </div>
                            )}
                            <div className="w-64 space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="font-bold capitalize text-lg">{opponentActive.name}</span>
                                    <span className="text-sm">HP: {opponentActive.currentHp}/{opponentActive.maxHp}</span>
                                </div>
                                <Progress value={(opponentActive.currentHp / opponentActive.maxHp) * 100} className="h-3" />
                                <div className="flex gap-1">
                                    {battleState.opponentTeam.map((p, i) => (
                                        <div key={i} className={`w-3 h-3 rounded-full ${i === battleState.activeOpponentIndex ? "bg-primary" : p.currentHp === 0 ? "bg-muted" : "bg-primary/30"}`} />
                                    ))}
                                </div>
                            </div>
                            <div className="relative w-48 h-48 animate-bounce" style={{ animationDuration: '3s' }}>
                                <Image
                                    src={opponentActive.sprite}
                                    alt={opponentActive.name}
                                    fill
                                    className="object-contain"
                                    unoptimized
                                />
                            </div>
                        </div>

                        {/* Player Side */}
                        <div className="flex flex-col items-start space-y-2">
                            <div className="relative w-48 h-48 animate-pulse" style={{ animationDuration: '4s' }}>
                                <Image
                                    src={playerActive.sprite}
                                    alt={playerActive.name}
                                    fill
                                    className="object-contain"
                                    unoptimized
                                />
                            </div>
                            <div className="w-64 space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="font-bold capitalize text-lg">{playerActive.name}</span>
                                    <span className="text-sm">HP: {playerActive.currentHp}/{playerActive.maxHp}</span>
                                </div>
                                <Progress value={(playerActive.currentHp / playerActive.maxHp) * 100} className="h-3 bg-secondary" />
                                <div className="flex gap-1">
                                    {battleState.playerTeam.map((p, i) => (
                                        <div key={i} className={`w-3 h-3 rounded-full ${i === battleState.activePlayerIndex ? "bg-primary" : p.currentHp === 0 ? "bg-destructive" : "bg-primary/30"}`} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>

                    {/* Controls */}
                    <div className="bg-background border-t p-6">
                        <div className="grid grid-cols-2 gap-4">
                            {playerActive.moves.map((move) => (
                                <Button
                                    key={move.name}
                                    className="h-16 text-lg capitalize"
                                    variant="outline"
                                    disabled={battleState.isFinished}
                                    onClick={() => handleMove(move.name)}
                                >
                                    {move.name.replace("-", " ")}
                                </Button>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* AI Strategist Sidebar */}
                <div className="space-y-6">
                    <Card className="border-primary/50 border-2">
                        <CardHeader className="bg-primary/10">
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-primary" />
                                AI Strategist
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            {isLoadingAdvice ? (
                                <div className="flex items-center gap-2 text-muted-foreground italic">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Analyzing battle field...
                                </div>
                            ) : advice ? (
                                <div className="space-y-4">
                                    <div className="p-3 bg-muted rounded-lg">
                                        <p className="text-sm font-semibold text-primary mb-1">Recommendation:</p>
                                        <p className="text-sm leading-relaxed">{advice.recommendation.replace(/Pokemon/gi, "Pokémon")}</p>
                                    </div>
                                    <div className="p-3 border rounded-lg">
                                        <p className="text-sm font-semibold mb-1">Analysis:</p>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{advice.analysis.replace(/Pokemon/gi, "Pokémon")}</p>
                                    </div>
                                    {advice.suggestedMove && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            <span>Suggested Move: <span className="font-bold capitalize">{advice.suggestedMove.replace("-", " ")}</span></span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground italic">Start a turn to receive strategic advice.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="h-[400px] flex flex-col">
                        <CardHeader className="py-3 bg-muted/30">
                            <CardTitle className="text-sm font-medium">Battle Log</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 overflow-hidden">
                            <ScrollArea className="h-full p-4" ref={scrollRef}>
                                <div className="space-y-2">
                                    {battleState.log.map((line, i) => (
                                        <p key={i} className="text-sm border-l-2 border-primary/20 pl-2 py-1">
                                            {line}
                                        </p>
                                    ))}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
