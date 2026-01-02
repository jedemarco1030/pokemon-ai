"use server"

interface SearchFilters {
    types?: string[]
    generation?: number
    color?: string
    habitat?: string
    isLegendary?: boolean
    isMythical?: boolean
    minHeight?: number
    maxHeight?: number
    minWeight?: number
    maxWeight?: number
}

export async function processNaturalLanguageSearch(query: string) {
    // In a real implementation, we would use an LLM (OpenAI/Gemini/etc.)
    // to parse the natural language query into structured filters.
    
    console.log("Processing NL Search query:", query);
    
    const lowerQuery = query.toLowerCase();
    const filters: SearchFilters = {};
    
    // Simple rule-based mock for common patterns to demonstrate the feature
    
    // Types
    const allTypes = ["normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"];
    const foundTypes = allTypes.filter(type => lowerQuery.includes(type));
    if (foundTypes.length > 0) filters.types = foundTypes;
    
    // Generations
    if (lowerQuery.includes("gen 1") || lowerQuery.includes("generation 1") || lowerQuery.includes("kanto")) filters.generation = 1;
    else if (lowerQuery.includes("gen 2") || lowerQuery.includes("generation 2") || lowerQuery.includes("johto")) filters.generation = 2;
    else if (lowerQuery.includes("gen 3") || lowerQuery.includes("generation 3") || lowerQuery.includes("hoenn")) filters.generation = 3;
    else if (lowerQuery.includes("gen 4") || lowerQuery.includes("generation 4") || lowerQuery.includes("sinnoh")) filters.generation = 4;
    else if (lowerQuery.includes("gen 5") || lowerQuery.includes("generation 5") || lowerQuery.includes("unova")) filters.generation = 5;
    
    // Colors
    const colors = ["red", "blue", "yellow", "green", "black", "brown", "purple", "gray", "white", "pink"];
    const foundColor = colors.find(color => lowerQuery.includes(color));
    if (foundColor) filters.color = foundColor;

    // Habitats
    const habitats = ["cave", "forest", "grassland", "mountain", "rare", "sea", "urban", "waters-edge"];
    const foundHabitat = habitats.find(h => lowerQuery.includes(h));
    if (foundHabitat) filters.habitat = foundHabitat;
    
    // Special
    if (lowerQuery.includes("legendary")) filters.isLegendary = true;
    if (lowerQuery.includes("mythical")) filters.isMythical = true;

    // To make this functional for the demo, we will actually search for matching Pokemon
    // In a production app, we would query our database with these filters.
    // For now, we will use PokeAPI with some limitations as it doesn't support complex filtering.
    
    try {
        // Since PokeAPI doesn't support multi-filter search, we'll fetch a batch and filter client/server-side
        // For Gen 1, we can limit the range. For colors/types/habitats we have specific endpoints.
        
        // This is a complex task for a single API call, so we'll simulate the "AI" finding these
        // by returning a list of Pokemon IDs that match.
        
        let results: number[] = [];
        
        if (filters.types && filters.types.length > 0) {
            // If types are specified, we can at least get those
            const typeRes = await fetch(`https://pokeapi.co/api/v2/type/${filters.types[0]}`);
            const typeData = await typeRes.json();
            results = typeData.pokemon.map((p: { pokemon: { url: string } }) => {
                const parts = p.pokemon.url.split("/");
                return parseInt(parts[parts.length - 2]);
            });
            
            // Further filter by generation if needed
            if (filters.generation) {
                const genLimits: Record<number, [number, number]> = {
                    1: [1, 151],
                    2: [152, 251],
                    3: [252, 386],
                    4: [387, 493],
                    5: [494, 649]
                };
                const [min, max] = genLimits[filters.generation];
                results = results.filter(id => id >= min && id <= max);
            }
        } else if (filters.generation) {
            const genLimits: Record<number, [number, number]> = {
                1: [1, 151],
                2: [152, 251],
                3: [252, 386],
                4: [387, 493],
                5: [494, 649]
            };
            const [min, max] = genLimits[filters.generation];
            results = Array.from({ length: max - min + 1 }, (_, i) => i + min);
        } else if (filters.color) {
            const colorRes = await fetch(`https://pokeapi.co/api/v2/pokemon-color/${filters.color}`);
            const colorData = await colorRes.json();
            results = colorData.pokemon_species.map((p: { url: string }) => {
                const parts = p.url.split("/");
                return parseInt(parts[parts.length - 2]);
            });
        } else if (filters.habitat) {
             const habitatRes = await fetch(`https://pokeapi.co/api/v2/pokemon-habitat/${filters.habitat}`);
             const habitatData = await habitatRes.json();
             results = habitatData.pokemon_species.map((p: { url: string }) => {
                 const parts = p.url.split("/");
                 return parseInt(parts[parts.length - 2]);
             });
        }
        
        // Return first 20 results
        return { 
            success: true, 
            filters,
            pokemonIds: results.slice(0, 20) 
        };
        
    } catch (error) {
        console.error("Error in NL search:", error);
        return { success: false, error: "Failed to process natural language search" };
    }
}
