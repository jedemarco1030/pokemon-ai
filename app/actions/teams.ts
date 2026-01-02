"use server"

import prisma from "@/lib/prisma/client"
import { revalidatePath } from "next/cache"

export async function getTeams(userId: string) {
    try {
        return await prisma.team.findMany({
            where: { user_id: userId },
            include: {
                members: {
                    orderBy: { slot: 'asc' }
                }
            },
            orderBy: { updated_at: 'desc' }
        })
    } catch (error) {
        console.error("Error fetching teams:", error)
        return []
    }
}

export async function getTeam(teamId: string) {
    try {
        return await prisma.team.findUnique({
            where: { id: teamId },
            include: {
                members: {
                    orderBy: { slot: 'asc' }
                }
            }
        })
    } catch (error) {
        console.error("Error fetching team:", error)
        return null
    }
}

export async function createTeam(userId: string, name: string, members: { pokemon_id: number, pokemon_name: string, slot: number }[]) {
    try {
        const team = await prisma.team.create({
            data: {
                user_id: userId,
                name: name,
                members: {
                    create: members
                }
            },
            include: {
                members: true
            }
        })
        revalidatePath("/team-builder")
        return { success: true, team }
    } catch (error) {
        console.error("Error creating team:", error)
        return { success: false, error: "Failed to create team" }
    }
}

export async function updateTeam(teamId: string, name: string, members: { pokemon_id: number, pokemon_name: string, slot: number }[]) {
    try {
        // Delete existing members first
        await prisma.teamMember.deleteMany({
            where: { team_id: teamId }
        })

        const team = await prisma.team.update({
            where: { id: teamId },
            data: {
                name: name,
                updated_at: new Date(),
                members: {
                    create: members
                }
            },
            include: {
                members: true
            }
        })
        revalidatePath("/team-builder")
        return { success: true, team }
    } catch (error) {
        console.error("Error updating team:", error)
        return { success: false, error: "Failed to update team" }
    }
}

export async function deleteTeam(teamId: string) {
    try {
        await prisma.team.delete({
            where: { id: teamId }
        })
        revalidatePath("/team-builder")
        return { success: true }
    } catch (error) {
        console.error("Error deleting team:", error)
        return { success: false, error: "Failed to delete team" }
    }
}

export async function suggestTeamMembers(currentMembers: { pokemon_id: number, pokemon_name: string }[]) {
    // This is a placeholder for AI logic.
    // In a real implementation, we would call an LLM here.

    try {
        // If we have an OpenAI API key, we could use it.
        // For now, let's just suggest some strong/popular Pokemon that aren't already in the team.
        const currentIds = new Set(currentMembers.map(m => m.pokemon_id))

        // Some legendary/strong Pokemon as fallback suggestions
        const suggestions = [
            { id: 150, name: "mewtwo", types: ["psychic"] },
            { id: 249, name: "lugia", types: ["psychic", "flying"] },
            { id: 384, name: "rayquaza", types: ["dragon", "flying"] },
            { id: 445, name: "garchomp", types: ["dragon", "ground"] },
            { id: 635, name: "hydreigon", types: ["dark", "dragon"] },
            { id: 149, name: "dragonite", types: ["dragon", "flying"] },
            { id: 94, name: "gengar", types: ["ghost", "poison"] },
            { id: 130, name: "gyarados", types: ["water", "flying"] },
            { id: 248, name: "tyranitar", types: ["rock", "dark"] },
            { id: 376, name: "metagross", types: ["steel", "psychic"] }
        ]

        const filteredSuggestions = suggestions
            .filter(s => !currentIds.has(s.id))
            .slice(0, 6 - currentMembers.length)
            .map(s => ({
                pokemon_id: s.id,
                pokemon_name: s.name,
                types: s.types,
                sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${s.id}.png`
            }))

        return { success: true, suggestions: filteredSuggestions }
    } catch (error) {
        console.error("Error suggesting team members:", error)
        return { success: false, error: "Failed to get suggestions" }
    }
}
