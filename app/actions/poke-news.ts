"use server"

import { PokeNewsItem, MetaAnalysis } from "@/types/poke-news";

export async function getPokeNews(): Promise<PokeNewsItem[]> {
    // In a real app, this would fetch from a database or a headless CMS
    // For this implementation, we'll provide a set of AI-generated/mock news items
    return [
        {
            id: "1",
            title: "Global Challenge 2026 Announced",
            content: "The first major tournament of the year has been announced! Trainers from across the globe will compete for a spot in the World Championships. Registration opens next Monday.",
            category: "Tournament",
            date: "2026-01-10",
            imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
            impact: "High"
        },
        {
            id: "2",
            title: "Patch 1.5: Balance Changes to Terastallization",
            content: "A new balance patch is rolling out. The damage bonus for same-type Terastallization has been slightly adjusted to encourage more defensive type switches.",
            category: "Game Update",
            date: "2026-01-05",
            imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1007.png",
            impact: "High"
        },
        {
            id: "3",
            title: "Mystical Forest Event Starting Soon",
            content: "Rumors of Celebi sightings in the Great Forest are spreading. Special research tasks will be available for all trainers starting this weekend.",
            category: "Event",
            date: "2026-01-15",
            imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/251.png",
            impact: "Medium"
        },
        {
            id: "4",
            title: "Community Spotlight: The Johto Cup",
            content: "The community-organized Johto Cup saw record participation this year. Congratulations to the winner who used an unconventional Sun-room team!",
            category: "Community",
            date: "2026-01-01",
            imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/157.png",
            impact: "Low"
        }
    ];
}

export async function getMetaAnalysis(): Promise<MetaAnalysis> {
    // AI-powered analysis of the current competitive meta
    return {
        topPokemon: [
            {
                pokemonId: 445,
                pokemonName: "Garchomp",
                usageRate: 35.5,
                trend: "up",
                reason: "Garchomp's versatility as a Stealth Rock setter and physical sweeper remains unmatched in the current format."
            },
            {
                pokemonId: 131,
                pokemonName: "Lapras",
                usageRate: 28.2,
                trend: "up",
                reason: "Recent buffs to Ice-type moves and its incredible bulk make Lapras a top choice for counter-meta teams."
            },
            {
                pokemonId: 135,
                pokemonName: "Jolteon",
                usageRate: 22.1,
                trend: "stable",
                reason: "Its high speed and access to Volt Switch make it the premier pivot for fast-paced offensive teams."
            },
            {
                pokemonId: 94,
                pokemonName: "Gengar",
                usageRate: 18.4,
                trend: "down",
                reason: "Increasing usage of bulky Dark-types like Tyranitar has made it harder for Gengar to sweep effectively."
            },
            {
                pokemonId: 248,
                pokemonName: "Tyranitar",
                usageRate: 25.7,
                trend: "up",
                reason: "A natural counter to the rising Psychic and Ghost-type presence, Tyranitar is a staple for sand-based strategies."
            }
        ],
        analysis: "The current meta is shifting towards 'Bulky Offense'. Trainers are prioritizing Pokémon that can take a hit and retaliate with heavy damage rather than glass cannons. Weather-based teams (Sand and Rain) are seeing a resurgence following the latest patch adjustments. Ground and Steel types are currently essential for any competitive roster due to their defensive utility.",
        lastUpdated: new Date().toISOString()
    };
}
