import { notFound } from "next/navigation"
import { PokemonDetailsView } from "@/components/pokemon-details-view"
import type { PokemonDetails } from "@/types/pokemon"

interface PageProps {
    params: Promise<{ id: string }>
}

async function getPokemonDetails(id: string): Promise<PokemonDetails | null> {
    try {
        // Fetch main Pokemon data
        const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, {
            next: { revalidate: 3600 },
        })

        if (!pokemonRes.ok) return null

        const pokemon = await pokemonRes.json()

        // Fetch species data for description and evolution chain
        const speciesRes = await fetch(pokemon.species.url, {
            next: { revalidate: 3600 },
        })
        const species = await speciesRes.json()

        // Fetch evolution chain
        const evolutionRes = await fetch(species.evolution_chain.url, {
            next: { revalidate: 3600 },
        })
        const evolutionData = await evolutionRes.json()

        // Parse evolution chain
        const evolutionChain: Array<{ id: number; name: string; sprite: string }> = []
        let currentEvolution = evolutionData.chain

        while (currentEvolution) {
            const evolutionId = currentEvolution.species.url.split("/").slice(-2, -1)[0]
            const evolutionPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${evolutionId}`, {
                next: { revalidate: 3600 },
            })
            const evolutionPokemonData = await evolutionPokemon.json()

            evolutionChain.push({
                id: Number.parseInt(evolutionId),
                name: currentEvolution.species.name,
                sprite: evolutionPokemonData.sprites.other["official-artwork"].front_default,
            })

            currentEvolution = currentEvolution.evolves_to[0]
        }

        // Get flavor text in English
        const flavorTextEntry = species.flavor_text_entries.find((entry: any) => entry.language.name === "en")
        const genusEntry = species.genera.find((entry: any) => entry.language.name === "en")

        return {
            id: pokemon.id,
            name: pokemon.name,
            height: pokemon.height,
            weight: pokemon.weight,
            sprite: pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default,
            types: pokemon.types.map((t: any) => t.type.name),
            stats: pokemon.stats.map((s: any) => ({
                name: s.stat.name,
                value: s.base_stat,
                maxValue: 255,
            })),
            abilities: pokemon.abilities.map((a: any) => a.ability.name),
            baseExperience: pokemon.base_experience,
            species: {
                flavorText: flavorTextEntry?.flavor_text.replace(/\f/g, " ") || "No description available.",
                genus: genusEntry?.genus || "Unknown",
                habitat: species.habitat?.name || null,
                generation: species.generation.name,
                captureRate: species.capture_rate,
                genderRate: species.gender_rate,
                growthRate: species.growth_rate.name,
            },
            heldItems: pokemon.held_items.map((item: any) => item.item.name),
            evolutionChain,
            moves: pokemon.moves
                .slice(0, 20)
                .map((m: any) => ({
                    name: m.move.name,
                    learnMethod: m.version_group_details[0]?.move_learn_method.name || "unknown",
                    level: m.version_group_details[0]?.level_learned_at || undefined,
                }))
                .sort((a: any, b: any) => (a.level || 999) - (b.level || 999)),
            games: pokemon.game_indices.map((g: any) => g.version.name).slice(0, 10),
        }
    } catch (error) {
        console.error("Error fetching Pokemon details:", error)
        return null
    }
}

export default async function PokemonDetailsPage({ params }: PageProps) {
    const { id } = await params
    const pokemon = await getPokemonDetails(id)

    if (!pokemon) {
        notFound()
    }

    return <PokemonDetailsView pokemon={pokemon} />
}
