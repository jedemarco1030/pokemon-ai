export interface Pokemon {
    id: number
    name: string
    height: number
    weight: number
    sprite: string
    types: string[]
}

export interface PokemonDetails extends Pokemon {
    stats: Array<{
        name: string
        value: number
        maxValue: number
    }>
    abilities: string[]
    baseExperience: number
    species: {
        flavorText: string
        genus: string
        habitat: string | null
        generation: string
        captureRate: number
        genderRate: number
        growthRate: string
    }
    heldItems: string[]
    evolutionChain: Array<{
        id: number
        name: string
        sprite: string
        minLevel?: number
        item?: string
        trigger?: string
    }>
    moves: Array<{
        name: string
        learnMethod: string
        level?: number
    }>
    games: string[]
}
