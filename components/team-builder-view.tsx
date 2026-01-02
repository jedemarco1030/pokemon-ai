"use client"

import { useState, useEffect, useCallback } from "react"
import type { User } from "@supabase/supabase-js"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Sparkles, Save, Loader2, Pencil } from "lucide-react"
import { createTeam, getTeams, deleteTeam, suggestTeamMembers } from "@/app/actions/teams"
import { toast } from "sonner"
import Image from "next/image"
import { PokemonSearchModal } from "@/components/pokemon-search-modal"
import { TypeAnalysis } from "@/components/type-analysis"

interface TeamMember {
    pokemon_id: number
    pokemon_name: string
    slot: number
    sprite?: string
    types?: string[]
}

interface Team {
    id: string
    name: string
    members: TeamMember[]
}

export function TeamBuilderView({ user }: { user: User }) {
    const [teamName, setTeamName] = useState("My Awesome Team")
    const [members, setMembers] = useState<(TeamMember | null)[]>([null, null, null, null, null, null])
    const [isSaving, setIsSaving] = useState(false)
    const [searchModalOpen, setSearchModalOpen] = useState(false)
    const [activeSlot, setActiveSlot] = useState<number | null>(null)
    const [savedTeams, setSavedTeams] = useState<Team[]>([])
    const [isLoadingTeams, setIsLoadingTeams] = useState(true)

    const fetchTeams = useCallback(async () => {
        setIsLoadingTeams(true)
        const teams = await getTeams(user.id)

        // Fetch details for each team member to get types
        const teamsWithDetails = await Promise.all(teams.map(async team => {
            const membersWithDetails = await Promise.all(team.members.map(async (member: { pokemon_id: number; pokemon_name: string; slot: number }) => {
                try {
                    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${member.pokemon_id}`)
                    const data = await response.json()
                    return {
                        ...member,
                        sprite: data.sprites.other["official-artwork"].front_default || data.sprites.front_default,
                        types: data.types.map((t: { type: { name: string } }) => t.type.name)
                    }
                } catch (error) {
                    console.error("Error fetching pokemon details:", error)
                    return {
                        ...member,
                        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${member.pokemon_id}.png`
                    }
                }
            }))
            return { ...team, members: membersWithDetails }
        }))

        setSavedTeams(teamsWithDetails)
        setIsLoadingTeams(false)
    }, [user.id])

    useEffect(() => {
        fetchTeams()
    }, [fetchTeams])

    const handleSlotClick = (slot: number) => {
        setActiveSlot(slot)
        setSearchModalOpen(true)
    }

    const handleSelectPokemon = (pokemon: { id: number, name: string, sprite: string, types: string[] }) => {
        if (activeSlot === null) return

        const newMembers = [...members]
        newMembers[activeSlot - 1] = {
            pokemon_id: pokemon.id,
            pokemon_name: pokemon.name,
            slot: activeSlot,
            sprite: pokemon.sprite,
            types: pokemon.types
        }
        setMembers(newMembers)
        setSearchModalOpen(false)
        setActiveSlot(null)
    }

    const removeMember = (slot: number) => {
        const newMembers = [...members]
        newMembers[slot - 1] = null
        setMembers(newMembers)
    }

    const handleSaveTeam = async () => {
        if (!teamName.trim()) {
            toast.error("Please enter a team name")
            return
        }

        const validMembers = members.filter((m): m is TeamMember => m !== null)
        if (validMembers.length === 0) {
            toast.error("Please add at least one Pokemon to your team")
            return
        }

        setIsSaving(true)
        const result = await createTeam(user.id, teamName, validMembers.map(m => ({
            pokemon_id: m.pokemon_id,
            pokemon_name: m.pokemon_name,
            slot: m.slot
        })))

        if (result.success) {
            toast.success("Team saved successfully!")
            fetchTeams()
            // Reset current team
            setMembers([null, null, null, null, null, null])
            setTeamName("My Awesome Team")
        } else {
            toast.error("Failed to save team")
        }
        setIsSaving(false)
    }

    const handleDeleteTeam = async (id: string) => {
        const result = await deleteTeam(id)
        if (result.success) {
            toast.success("Team deleted")
            fetchTeams()
        } else {
            toast.error("Failed to delete team")
        }
    }

    const [isSuggesting, setIsSuggesting] = useState(false)

    const handleAISuggest = async () => {
        const validMembers = members.filter((m): m is TeamMember => m !== null)
        if (validMembers.length >= 6) {
            toast.error("Team is already full!")
            return
        }

        setIsSuggesting(true)
        try {
            const result = await suggestTeamMembers(validMembers.map(m => ({
                pokemon_id: m.pokemon_id,
                pokemon_name: m.pokemon_name
            })))

            if (result.success && result.suggestions) {
                const newMembers = [...members]
                let suggestionIndex = 0

                for (let i = 0; i < 6; i++) {
                    if (!newMembers[i] && suggestionIndex < result.suggestions.length) {
                        const suggestion = result.suggestions[suggestionIndex]
                        newMembers[i] = {
                            pokemon_id: suggestion.pokemon_id,
                            pokemon_name: suggestion.pokemon_name,
                            slot: i + 1,
                            sprite: suggestion.sprite,
                            types: suggestion.types
                        }
                        suggestionIndex++
                    }
                }

                setMembers(newMembers)
                toast.success("AI suggested some Pokemon for your team!")
            } else {
                toast.error(result.error || "Failed to get AI suggestions")
            }
        } catch (error) {
            console.error("Error getting AI suggestions:", error)
            toast.error("An error occurred while getting suggestions")
        } finally {
            setIsSuggesting(false)
        }
    }

    const handleEditTeam = (team: Team) => {
        setTeamName(team.name)
        const newMembers: (TeamMember | null)[] = [null, null, null, null, null, null]
        team.members.forEach(member => {
            newMembers[member.slot - 1] = member
        })
        setMembers(newMembers)
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className="space-y-12">
            <section className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold">New Team</h1>
                        <p className="text-muted-foreground">Select up to 6 Pokemon to build your team.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={handleAISuggest} disabled={isSuggesting} className="gap-2">
                            {isSuggesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                            AI Suggest
                        </Button>
                        <Button onClick={handleSaveTeam} disabled={isSaving} className="gap-2">
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Team
                        </Button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="max-w-md w-full">
                        <Label htmlFor="teamName">Team Name</Label>
                        <Input
                            id="teamName"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            placeholder="Enter team name..."
                            className="mt-1"
                        />
                    </div>
                    <TypeAnalysis members={members.filter((m): m is TeamMember => m !== null)} />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {members.map((member, index) => (
                        <Card
                            key={index}
                            className={`relative aspect-square cursor-pointer transition-all hover:border-primary ${member ? "border-primary" : "border-dashed"}`}
                            onClick={() => !member && handleSlotClick(index + 1)}
                        >
                            {member ? (
                                <CardContent className="p-2 h-full flex flex-col items-center justify-center">
                                    <div className="relative w-full h-2/3">
                                        <Image
                                            src={member.sprite || "/placeholder.svg"}
                                            alt={member.pokemon_name}
                                            fill
                                            className="object-contain"
                                            unoptimized
                                        />
                                    </div>
                                    <p className="text-xs font-bold capitalize mt-2 truncate w-full text-center">
                                        {member.pokemon_name}
                                    </p>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-1 right-1 h-6 w-6 text-destructive hover:bg-destructive/10"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            removeMember(index + 1)
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </CardContent>
                            ) : (
                                <CardContent className="p-2 h-full flex flex-col items-center justify-center text-muted-foreground hover:text-primary">
                                    <Plus className="w-8 h-8 mb-2" />
                                    <p className="text-xs font-medium">Slot {index + 1}</p>
                                </CardContent>
                            )}
                        </Card>
                    ))}
                </div>
            </section>

            <section className="space-y-6 border-t pt-12">
                <h2 className="text-2xl font-bold">Your Saved Teams</h2>
                {isLoadingTeams ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : savedTeams.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">No saved teams yet. Start building one above!</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {savedTeams.map((team) => (
                            <Card key={team.id} className="overflow-hidden">
                                <CardHeader className="flex flex-row items-center justify-between bg-muted/50 py-3">
                                    <CardTitle className="text-lg">{team.name}</CardTitle>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEditTeam(team)}
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:bg-destructive/10"
                                            onClick={() => handleDeleteTeam(team.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <div className="grid grid-cols-6 gap-2">
                                        {[1, 2, 3, 4, 5, 6].map(slot => {
                                            const member = team.members.find(m => m.slot === slot)
                                            return (
                                                <div key={slot} className="aspect-square relative bg-secondary rounded-md overflow-hidden">
                                                    {member && (
                                                        <Image
                                                            src={member.sprite || "/placeholder.svg"}
                                                            alt={member.pokemon_name}
                                                            fill
                                                            className="object-contain p-1"
                                                            unoptimized
                                                        />
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </section>

            <PokemonSearchModal
                open={searchModalOpen}
                onOpenChange={setSearchModalOpen}
                onSelect={handleSelectPokemon}
            />
        </div>
    )
}
