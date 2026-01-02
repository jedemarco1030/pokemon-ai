export interface PokeNewsItem {
    id: string;
    title: string;
    content: string;
    category: "Game Update" | "Tournament" | "Event" | "Community";
    date: string;
    imageUrl?: string;
    impact: "High" | "Medium" | "Low";
}

export interface MetaTrend {
    pokemonId: number;
    pokemonName: string;
    usageRate: number;
    trend: "up" | "down" | "stable";
    reason: string;
}

export interface MetaAnalysis {
    topPokemon: MetaTrend[];
    analysis: string;
    lastUpdated: string;
}
