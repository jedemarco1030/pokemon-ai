import { PokemonDetails } from "./pokemon";

export interface BattlePokemon extends PokemonDetails {
    currentHp: number;
    maxHp: number;
    statusEffects: string[];
}

export interface BattleState {
    playerTeam: BattlePokemon[];
    opponentTeam: BattlePokemon[];
    activePlayerIndex: number;
    activeOpponentIndex: number;
    log: string[];
    turn: number;
    isFinished: boolean;
    winner: "player" | "opponent" | null;
    personaId?: string; // ID of the Gym Leader being challenged
}

export interface MoveRecommendation {
    moveName: string;
    reason: string;
    effectiveness: "super-effective" | "effective" | "not-very-effective" | "ineffective";
}

export interface BattleAdvice {
    recommendation: string;
    analysis: string;
    suggestedMove?: string;
    personaDialogue?: string; // Character-accurate dialogue
}
