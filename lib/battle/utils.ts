export const TYPE_CHART: Record<string, { superEffective: string[], notVeryEffective: string[], ineffective: string[] }> = {
    fire: { superEffective: ['grass', 'ice', 'bug', 'steel'], notVeryEffective: ['fire', 'water', 'rock', 'dragon'], ineffective: [] },
    water: { superEffective: ['fire', 'ground', 'rock'], notVeryEffective: ['water', 'grass', 'dragon'], ineffective: [] },
    grass: { superEffective: ['water', 'ground', 'rock'], notVeryEffective: ['fire', 'grass', 'poison', 'flying', 'bug', 'dragon', 'steel'], ineffective: [] },
    electric: { superEffective: ['water', 'flying'], notVeryEffective: ['electric', 'grass', 'dragon'], ineffective: ['ground'] },
    psychic: { superEffective: ['fighting', 'poison'], notVeryEffective: ['psychic', 'steel'], ineffective: ['dark'] },
    ice: { superEffective: ['grass', 'ground', 'flying', 'dragon'], notVeryEffective: ['fire', 'water', 'ice', 'steel'], ineffective: [] },
    ground: { superEffective: ['fire', 'electric', 'poison', 'rock', 'steel'], notVeryEffective: ['grass', 'bug'], ineffective: ['flying'] },
    rock: { superEffective: ['fire', 'ice', 'flying', 'bug'], notVeryEffective: ['fighting', 'ground', 'steel'], ineffective: [] },
    flying: { superEffective: ['grass', 'fighting', 'bug'], notVeryEffective: ['electric', 'rock', 'steel'], ineffective: [] },
    bug: { superEffective: ['grass', 'psychic', 'dark'], notVeryEffective: ['fire', 'fighting', 'poison', 'flying', 'ghost', 'steel', 'fairy'], ineffective: [] },
    poison: { superEffective: ['grass', 'fairy'], notVeryEffective: ['poison', 'ground', 'rock', 'ghost'], ineffective: ['steel'] },
    fighting: { superEffective: ['normal', 'ice', 'rock', 'dark', 'steel'], notVeryEffective: ['poison', 'flying', 'psychic', 'bug', 'fairy'], ineffective: ['ghost'] },
    ghost: { superEffective: ['psychic', 'ghost'], notVeryEffective: ['dark'], ineffective: ['normal'] },
    dragon: { superEffective: ['dragon'], notVeryEffective: ['steel'], ineffective: ['fairy'] },
    dark: { superEffective: ['psychic', 'ghost'], notVeryEffective: ['fighting', 'dark', 'fairy'], ineffective: [] },
    steel: { superEffective: ['ice', 'rock', 'fairy'], notVeryEffective: ['fire', 'water', 'electric', 'steel'], ineffective: [] },
    fairy: { superEffective: ['fighting', 'dragon', 'dark'], notVeryEffective: ['fire', 'poison', 'steel'], ineffective: [] },
    normal: { superEffective: [], notVeryEffective: ['rock', 'steel'], ineffective: ['ghost'] }
};

export function getEffectiveness(moveType: string, targetTypes: string[]): number {
    let multiplier = 1;
    const matchup = TYPE_CHART[moveType.toLowerCase()];
    if (!matchup) return 1;

    targetTypes.forEach(t => {
        const targetType = t.toLowerCase();
        if (matchup.superEffective.includes(targetType)) multiplier *= 2;
        if (matchup.notVeryEffective.includes(targetType)) multiplier *= 0.5;
        if (matchup.ineffective.includes(targetType)) multiplier *= 0;
    });
    return multiplier;
}

export function calculateDamage(attackerAtk: number, defenderDef: number, movePower: number = 40, effectiveness: number = 1): number {
    // Basic Pokemon damage formula (simplified)
    // Damage = (((2 * Level / 5 + 2) * Power * A/D) / 50 + 2) * Modifier
    // Assuming level 50
    const level = 50;
    const baseDamage = (((2 * level / 5 + 2) * movePower * (attackerAtk / defenderDef)) / 50 + 2);
    const randomModifier = Math.random() * (1.0 - 0.85) + 0.85;
    return Math.floor(baseDamage * effectiveness * randomModifier);
}
