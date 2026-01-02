"use server"

import { BattleState, BattleAdvice } from "@/types/battle";
import { GYM_LEADERS } from "@/lib/battle/personas";
import { getEffectiveness } from "@/lib/battle/utils";

export async function getBattleAdvice(state: BattleState): Promise<{ success: true, advice: BattleAdvice } | { success: false, error: string }> {
    // In a real implementation, this would call an LLM (OpenAI/Anthropic)
    // with the full battle state to get strategic advice and persona dialogue.

    try {
        const playerActive = state.playerTeam[state.activePlayerIndex];
        const opponentActive = state.opponentTeam[state.activeOpponentIndex];

        if (!playerActive || !opponentActive) {
            return { success: false, error: "Invalid battle state" };
        }

        // Simple mock implementation of AI strategy
        let recommendation = "Use your strongest move!";
        let analysis = `Your ${playerActive.name} (${playerActive.types.join("/")}) is facing ${opponentActive.name} (${opponentActive.types.join("/")}). `;
        let suggestedMove = playerActive.moves[0]?.name;
        let personaDialogue = undefined;

        // If there's a persona, generate character-accurate dialogue
        if (state.personaId) {
            const persona = GYM_LEADERS.find(p => p.id === state.personaId);
            if (persona) {
                if (state.isFinished) {
                    personaDialogue = state.winner === "opponent"
                        ? persona.dialogue.win[Math.floor(Math.random() * persona.dialogue.win.length)]
                        : persona.dialogue.defeat[Math.floor(Math.random() * persona.dialogue.defeat.length)];
                } else if (opponentActive.currentHp < opponentActive.maxHp * 0.3) {
                    personaDialogue = persona.dialogue.lowHp[Math.floor(Math.random() * persona.dialogue.lowHp.length)];
                } else if (state.turn === 1) {
                    personaDialogue = persona.dialogue.start[Math.floor(Math.random() * persona.dialogue.start.length)];
                } else {
                    personaDialogue = persona.dialogue.mid[Math.floor(Math.random() * persona.dialogue.mid.length)];
                }
            }
        }

        // Try to find a move that is super effective
        let bestMultiplier = 0;
        playerActive.moves.forEach(m => {
            // In a real implementation we would fetch the move type from PokeAPI
            // For now, let's assume one of the Pokemon's types if not specified
            const moveType = playerActive.types[0]; 
            const effectiveness = getEffectiveness(moveType, opponentActive.types);
            if (effectiveness > bestMultiplier) {
                bestMultiplier = effectiveness;
                suggestedMove = m.name;
            }
        });

        if (bestMultiplier > 1) {
            analysis += `You have a type advantage! ${suggestedMove} should deal massive damage. `;
            recommendation = "Press the advantage with super-effective moves.";
        } else if (bestMultiplier < 1) {
            analysis += `Your current moves might not be very effective. Consider switching or using your strongest neutral move. `;
            recommendation = "Be cautious, the opponent has a defensive advantage.";
        } else {
            analysis += `It's an even match-up. Focus on outlasting them. `;
            recommendation = "Maintain pressure with your best moves.";
        }

        if (playerActive.currentHp < playerActive.maxHp * 0.3) {
            recommendation = "Low HP warning! Try to finish them off quickly or consider a tactical play.";
        }

        return {
            success: true,
            advice: {
                recommendation,
                analysis,
                suggestedMove,
                personaDialogue
            }
        };
    } catch (error) {
        console.error("Error getting battle advice:", error);
        return { success: false, error: "Failed to generate AI advice" };
    }
}
