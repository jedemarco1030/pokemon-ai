"use client"

import { PokemonCard } from "@/components/pokemon-card"
import type { Pokemon } from "@/types/pokemon"
import type { User } from "@supabase/supabase-js"

interface PokemonListProps {
    pokemon: Pokemon[]
    user: User | null
    favorites: Set<number>
    onToggleFavorite: (pokemonId: number, pokemonName: string) => void
    isFavorited: (pokemonId: number) => boolean
}

export function PokemonList({ pokemon, user, onToggleFavorite, isFavorited }: PokemonListProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pokemon.map((poke) => (
                <PokemonCard
                    key={poke.id}
                    pokemon={poke}
                    user={user}
                    isFavorited={isFavorited(poke.id)}
                    onToggleFavorite={onToggleFavorite}
                />
            ))}
        </div>
    )
}
