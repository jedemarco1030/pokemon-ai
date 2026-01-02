"use client"

import { useState } from "react"
import type { User } from "@supabase/supabase-js"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, Loader2, Wand2, Shield, Sword, Zap, Heart } from "lucide-react"
import { getMoveOptimization } from "@/app/actions/move-optimizer"
import { PokemonSearchModal } from "@/components/pokemon-search-modal"
import type { MoveSetOptimization } from "@/types/move-optimizer"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

const roles = [
    { value: "Sweeper", label: "Sweeper (Offensive)", icon: Sword },
    { value: "Tank", label: "Tank (Defensive)", icon: Shield },
    { value: "Support", label: "Support (Utility)", icon: Heart },
    { value: "Fast Attacker", label: "Fast Attacker", icon: Zap },
    { value: "Revenge Killer", label: "Revenge Killer", icon: Wand2 },
]

export function MoveOptimizerView({ user: _user }: { user: User }) {
    const [selectedPokemon, setSelectedPokemon] = useState<{ id: number, name: string, sprite: string } | null>(null)
    const [selectedRole, setSelectedRole] = useState<string>("Sweeper")
    const [isOptimizing, setIsOptimizing] = useState(false)
    const [optimization, setOptimization] = useState<MoveSetOptimization | null>(null)
    const [searchModalOpen, setSearchModalOpen] = useState(false)

    const handleSelectPokemon = (pokemon: { id: number, name: string, sprite: string }) => {
        setSelectedPokemon(pokemon)
        setSearchModalOpen(false)
        setOptimization(null)
    }

    const handleOptimize = async () => {
        if (!selectedPokemon) {
            toast.error("Please select a Pokemon first")
            return
        }

        setIsOptimizing(true)
        try {
            const result = await getMoveOptimization(selectedPokemon.id, selectedPokemon.name, selectedRole)
            if (result.success && result.optimization) {
                setOptimization(result.optimization)
                toast.success("AI Move Set generated!")
            } else {
                toast.error(result.error || "Failed to generate optimization")
            }
        } catch {
            toast.error("An error occurred")
        } finally {
            setIsOptimizing(false)
        }
    }

    return (
        <div className="space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    AI Move Set Optimizer
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Fine-tune your Pokemon for any role. Our AI analyzes stats and movepools to recommend the best builds.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <Card className="md:col-span-1 border-2">
                    <CardHeader>
                        <CardTitle>Configuration</CardTitle>
                        <CardDescription>Select a Pokemon and its intended role.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Pokemon</Label>
                            {selectedPokemon ? (
                                <div className="flex items-center justify-between p-3 border rounded-md bg-secondary/30">
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-10 h-10">
                                            <Image
                                                src={selectedPokemon.sprite}
                                                alt={selectedPokemon.name}
                                                fill
                                                className="object-contain"
                                                unoptimized
                                            />
                                        </div>
                                        <span className="font-bold capitalize">{selectedPokemon.name}</span>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => setSearchModalOpen(true)}>Change</Button>
                                </div>
                            ) : (
                                <Button
                                    variant="outline"
                                    className="w-full h-12 border-dashed border-2 flex items-center justify-center gap-2"
                                    onClick={() => setSearchModalOpen(true)}
                                >
                                    <Sparkles className="w-4 h-4 text-primary" />
                                    Select Pokemon
                                </Button>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">Intended Role</Label>
                            <Select value={selectedRole} onValueChange={setSelectedRole}>
                                <SelectTrigger id="role">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem key={role.value} value={role.value}>
                                            <div className="flex items-center gap-2">
                                                <role.icon className="w-4 h-4" />
                                                {role.label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            className="w-full gap-2"
                            size="lg"
                            disabled={!selectedPokemon || isOptimizing}
                            onClick={handleOptimize}
                        >
                            {isOptimizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                            Optimize Move Set
                        </Button>
                    </CardContent>
                </Card>

                <div className="md:col-span-2">
                    {optimization ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Card className="border-primary/20">
                                <CardHeader className="bg-primary/5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-2xl flex items-center gap-2">
                                                <Sparkles className="w-6 h-6 text-primary" />
                                                AI Recommended Build
                                            </CardTitle>
                                            <CardDescription>Optimized for {optimization.role} role</CardDescription>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">Item: <span className="text-primary">{optimization.recommended_item}</span></p>
                                            <p className="text-sm font-medium">Nature: <span className="text-primary">{optimization.recommended_nature}</span></p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-6">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="space-y-4">
                                            <h3 className="font-bold text-lg flex items-center gap-2">
                                                <Sword className="w-5 h-5 text-primary" />
                                                Recommended Moves
                                            </h3>
                                            <div className="space-y-2">
                                                {optimization.recommended_moves.map((move, i) => (
                                                    <div key={i} className="p-3 border rounded-lg bg-muted/30">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="font-bold capitalize">{move.move_name}</span>
                                                            <div className="flex gap-1">
                                                                <Badge variant="secondary" className="text-[10px] capitalize">{move.type}</Badge>
                                                                <Badge variant="outline" className="text-[10px] capitalize">{move.category}</Badge>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">{move.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="space-y-3">
                                                <h3 className="font-bold text-lg flex items-center gap-2">
                                                    <Zap className="w-5 h-5 text-primary" />
                                                    Base Strategy
                                                </h3>
                                                <div className="p-4 border rounded-lg bg-secondary/20">
                                                    <p className="text-sm leading-relaxed italic">&quot;{optimization.strategy_insight}&quot;</p>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Technical Specs</h3>
                                                <div className="grid grid-cols-1 gap-2">
                                                    <div className="flex justify-between p-2 border-b">
                                                        <span className="text-xs font-medium">EV Spread</span>
                                                        <span className="text-xs font-bold text-primary">{optimization.ev_spread}</span>
                                                    </div>
                                                    <div className="flex justify-between p-2 border-b">
                                                        <span className="text-xs font-medium">Ability</span>
                                                        <span className="text-xs font-bold text-primary">{optimization.recommended_ability}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <Card className="h-full border-dashed border-2 flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                            <Wand2 className="w-16 h-16 mb-4 opacity-20" />
                            <h3 className="text-xl font-semibold mb-2">No Optimization Generated</h3>
                            <p className="max-w-xs">Select a Pokemon and click &quot;Optimize Move Set&quot; to see the AI&apos;s recommendations.</p>
                        </Card>
                    )}
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
