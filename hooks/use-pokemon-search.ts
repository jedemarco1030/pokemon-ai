"use client"

import { useState, useEffect, useCallback } from "react"
import type { Pokemon } from "@/types/pokemon"

interface PokemonApiResponse {
    id: number
    name: string
    height: number
    weight: number
    sprites: {
        other: {
            "official-artwork": {
                front_default: string
            }
        }
    }
    types: Array<{
        type: {
            name: string
        }
    }>
}

interface PokemonListResponse {
    results: Array<{
        name: string
        url: string
    }>
    count: number
    next: string | null
}

export function usePokemonSearch() {
    const [pokemon, setPokemon] = useState<Pokemon[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [offset, setOffset] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const [currentQuery, setCurrentQuery] = useState("")
    const [allPokemon, setAllPokemon] = useState<Array<{ name: string; url: string }>>([])
    const limit = 20

    useEffect(() => {
        const fetchAllPokemonNames = async () => {
            try {
                const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10000")
                const data: PokemonListResponse = await response.json()
                setAllPokemon(data.results)
            } catch (err) {
                console.error("Failed to fetch Pokemon list:", err)
            }
        }
        fetchAllPokemonNames()
    }, [])

    const fetchPokemonDetails = useCallback(async (nameOrId: string): Promise<Pokemon> => {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId.toLowerCase()}`)
        if (!response.ok) {
            throw new Error(`Pokemon not found: ${nameOrId}`)
        }
        const data: PokemonApiResponse = await response.json()

        return {
            id: data.id,
            name: data.name,
            height: data.height,
            weight: data.weight,
            sprite: data.sprites.other["official-artwork"].front_default,
            types: data.types.map((t) => t.type.name),
        }
    }, [])

    const searchPokemon = useCallback(async (query: string) => {
        setLoading(true)
        setError(null)
        setPokemon([])
        setOffset(0)
        setCurrentQuery(query)

        try {
            const trimmedQuery = query.trim().toLowerCase()

            if (trimmedQuery.length >= 3) {
                const matchingPokemon = allPokemon.filter((p) => p.name.includes(trimmedQuery))

                if (matchingPokemon.length === 0) {
                    setError(`No Pokemon found matching "${query}"`)
                    setPokemon([])
                    setHasMore(false)
                } else {
                    const pokemonToFetch = matchingPokemon.slice(0, limit)
                    const pokemonDetails = await Promise.all(pokemonToFetch.map((p) => fetchPokemonDetails(p.name)))

                    setPokemon(pokemonDetails)
                    setOffset(limit)
                    setHasMore(matchingPokemon.length > limit)
                }
            } else if (trimmedQuery.length === 0) {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=0`)
                const data: PokemonListResponse = await response.json()

                const pokemonDetails = await Promise.all(data.results.map((p) => fetchPokemonDetails(p.name)))

                setPokemon(pokemonDetails)
                setOffset(limit)
                setHasMore(data.next !== null)
            } else {
                setPokemon([])
                setHasMore(false)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch Pokemon")
            setPokemon([])
        } finally {
            setLoading(false)
        }
    }, [allPokemon, fetchPokemonDetails, limit])

    const loadMore = useCallback(async () => {
        if (loading || !hasMore) return

        setLoading(true)
        setError(null)

        try {
            const trimmedQuery = currentQuery.trim().toLowerCase()

            if (trimmedQuery.length >= 3) {
                const matchingPokemon = allPokemon.filter((p) => p.name.includes(trimmedQuery))
                const pokemonToFetch = matchingPokemon.slice(offset, offset + limit)

                const pokemonDetails = await Promise.all(pokemonToFetch.map((p) => fetchPokemonDetails(p.name)))

                setPokemon((prev) => [...prev, ...pokemonDetails])
                setOffset((prev) => prev + limit)
                setHasMore(matchingPokemon.length > offset + limit)
            } else {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
                const data: PokemonListResponse = await response.json()

                const pokemonDetails = await Promise.all(data.results.map((p) => fetchPokemonDetails(p.name)))

                setPokemon((prev) => [...prev, ...pokemonDetails])
                setOffset((prev) => prev + limit)
                setHasMore(data.next !== null)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load more Pokemon")
        } finally {
            setLoading(false)
        }
    }, [loading, hasMore, currentQuery, allPokemon, offset, limit, fetchPokemonDetails])

    return {
        pokemon,
        loading,
        error,
        searchPokemon,
        loadMore,
        hasMore,
    }
}
