"use server"

import prisma from "@/lib/prisma/client"
import { revalidatePath } from "next/cache"

export async function getFavorites(userId: string) {
    try {
        const favorites = await prisma.favorite.findMany({
            where: { user_id: userId },
            select: { pokemon_id: true }
        })
        return favorites.map((f: { pokemon_id: number }) => f.pokemon_id)
    } catch (error) {
        console.error("Error fetching favorites:", error)
        return []
    }
}

export async function toggleFavoriteAction(userId: string, pokemonId: number, pokemonName: string) {
    try {
        const existing = await prisma.favorite.findUnique({
            where: {
                user_id_pokemon_id: {
                    user_id: userId,
                    pokemon_id: pokemonId
                }
            }
        })

        if (existing) {
            await prisma.favorite.delete({
                where: {
                    user_id_pokemon_id: {
                        user_id: userId,
                        pokemon_id: pokemonId
                    }
                }
            })
        } else {
            await prisma.favorite.create({
                data: {
                    user_id: userId,
                    pokemon_id: pokemonId,
                    pokemon_name: pokemonName
                }
            })
        }
        revalidatePath("/favorites")
        return { success: true }
    } catch (error) {
        console.error("Error toggling favorite:", error)
        return { success: false, error: "Failed to toggle favorite" }
    }
}

export async function getProfile(userId: string) {
    if (!userId) return null;
    try {
        console.log(`[getProfile] Fetching profile for userId: ${userId}`);
        const profile = await prisma.profile.findUnique({
            where: { id: userId }
        })
        console.log(`[getProfile] Found profile:`, profile);
        return profile;
    } catch (error) {
        console.error("[getProfile] Error fetching profile:", error instanceof Error ? error.message : error)
        return null;
    }
}

export async function createOrUpdateProfile(userId: string, data: { first_name: string, last_name: string, email?: string }) {
    if (!userId) return null;
    try {
        console.log(`[createOrUpdateProfile] Upserting profile for userId: ${userId}`, data);
        const profile = await prisma.profile.upsert({
            where: { id: userId },
            update: data,
            create: {
                id: userId,
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email || ""
            }
        })
        console.log(`[createOrUpdateProfile] Upserted profile:`, profile);
        revalidatePath("/settings")
        return profile;
    } catch (error) {
        console.error("[createOrUpdateProfile] Error upserting profile:", error instanceof Error ? error.message : error)
        return null;
    }
}
