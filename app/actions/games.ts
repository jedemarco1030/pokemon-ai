"use server"

import { GameDetails, GameListResponse } from "@/types/games"

export async function getGames() {
    try {
        const response = await fetch("https://pokeapi.co/api/v2/version-group?limit=100")
        const data = (await response.json()) as GameListResponse

        // Filter out some non-mainline or redundant groups if necessary,
        // but for now let's just return all and maybe sort them.
        return data.results.map((game: { url: string; name: string }) => ({
            ...game,
            id: parseInt(game.url.split("/").slice(-2, -1)[0])
        })).sort((a: { id: number }, b: { id: number }) => a.id - b.id)
    } catch (error) {
        console.error("Error fetching games:", error)
        return []
    }
}

export async function getGameDetails(idOrName: string | number): Promise<GameDetails | null> {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/version-group/${idOrName}`)
        if (!response.ok) return null
        const data = await response.json()

        // Fetch generation data to get some pokemon
        const genResponse = await fetch(data.generation.url)
        const genData = await genResponse.json()

        // Get first 10 Pokémon from this generation as "main" Pokémon
        const mainPokemon = await Promise.all(
            genData.pokemon_species.slice(0, 12).map(async (species: { url: string }) => {
                const id = species.url.split("/").slice(-2, -1)[0]
                const pokeRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
                const pokeData = await pokeRes.json()
                return {
                    id: pokeData.id,
                    name: pokeData.name,
                    sprite: pokeData.sprites.other["official-artwork"].front_default || pokeData.sprites.front_default
                }
            })
        )

        // Fetch locations from the first region
        let locations: { name: string; url: string }[] = []
        if (data.regions.length > 0) {
            const regionRes = await fetch(data.regions[0].url)
            const regionData = await regionRes.json()
            locations = regionData.locations.slice(0, 20) // Limit to 20 for display
        }

        return {
            id: data.id,
            name: data.name,
            generation: data.generation,
            regions: data.regions,
            versions: data.versions,
            pokedexes: data.pokedexes,
            locations,
            mainPokemon
        }
    } catch (error) {
        console.error("Error fetching game details:", error)
        return null
    }
}
