"use server"

import prisma from "@/lib/prisma/client"
import { Pokemon } from "@/types/pokemon"

export async function getPersonalizedRecommendations(userId: string) {
    try {
        // 1. Get user's favorites
        const favorites = await prisma.favorite.findMany({
            where: { user_id: userId },
            select: { pokemon_id: true, pokemon_name: true }
        })

        if (favorites.length === 0) {
            return {
                success: true,
                recommendations: [],
                insight: "Add some Pokemon to your favorites to get personalized recommendations!"
            }
        }

        // 2. Fetch details for favorite Pokemon to analyze patterns
        const favoriteDetails = await Promise.all(
            favorites.slice(0, 5).map(async (fav: { pokemon_id: number; pokemon_name: string }) => {
                try {
                    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${fav.pokemon_id}`)
                    return await res.json()
                } catch {
                    return null
                }
            })
        )

        const validDetails = favoriteDetails.filter((d: any) => d !== null)

        // 3. Simple Recommendation Logic: Recommend Pokémon of the same types
        const types = new Array<string>()
        validDetails.forEach((d: any) => {
            (d as { types: { type: { name: string } }[] }).types.forEach((t: { type: { name: string } }) => types.push(t.type.name))
        })

        // Find most common type
        const typeCounts: Record<string, number> = {}
        types.forEach(t => {
            typeCounts[t] = (typeCounts[t] || 0) + 1
        })

        const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0][0]

        // 4. Fetch Pokémon of that type from PokeAPI
        const typeRes = await fetch(`https://pokeapi.co/api/v2/type/${topType}`)
        const typeData = await typeRes.json()

        const favoriteIds = new Set(favorites.map((f: { pokemon_id: number }) => f.pokemon_id))
        const candidates = typeData.pokemon
            .map((p: { pokemon: { url: string, name: string } }) => {
                const id = parseInt(p.pokemon.url.split('/').slice(-2, -1)[0])
                return { id, name: p.pokemon.name }
            })
            .filter((p: { id: number }) => !favoriteIds.has(p.id))
            .slice(0, 8)

        // 5. Fetch full details for the recommendations
        const recommendations: Pokemon[] = await Promise.all(
            candidates.map(async (p: { id: number }) => {
                const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${p.id}`)
                const data = await res.json()
                return {
                    id: data.id,
                    name: data.name,
                    height: data.height,
                    weight: data.weight,
                    sprite: data.sprites.other["official-artwork"].front_default || data.sprites.front_default,
                    types: data.types.map((t: { type: { name: string } }) => t.type.name)
                }
            })
        )

        return {
            success: true,
            recommendations,
            insight: `Based on your interest in ${topType}-type Pokemon like ${favorites[0].pokemon_name}, we think you'll love these!`
        }

    } catch (error) {
        console.error("Error generating recommendations:", error)
        return {
            success: false,
            error: "Failed to generate recommendations",
            recommendations: []
        }
    }
}
