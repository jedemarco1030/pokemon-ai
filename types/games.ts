export interface GameBase {
    id: number
    name: string
    url: string
}

export interface GameListResponse {
    count: number
    next: string | null
    previous: string | null
    results: GameBase[]
}

export interface GameDetails {
    id: number
    name: string
    generation: {
        name: string
        url: string
    }
    regions: Array<{
        name: string
        url: string
    }>
    versions: Array<{
        name: string
        url: string
    }>
    pokedexes: Array<{
        name: string
        url: string
    }>
    locations: Array<{
        name: string
        url: string
    }>
    mainPokemon: Array<{
        id: number
        name: string
        sprite: string
    }>
}
