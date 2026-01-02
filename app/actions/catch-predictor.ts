"use server"

export async function calculateCatchProbability(
    pokemonId: number,
    hpPercentage: number,
    statusCondition: string,
    ballType: string,
    captureRate: number
) {
    try {
        // Simplified Pokemon Catch Formula (Generation 3+)
        // Catch Value (a) = (((3 * MaxHP - 2 * CurrentHP) * CaptureRate * BallModifier) / (3 * MaxHP)) * StatusModifier

        // Since we don't have exact HP values, we use percentages
        // Let's assume MaxHP = 100 for percentage calculation
        const maxHP = 100;
        const currentHP = (hpPercentage / 100) * maxHP;

        // Ball Modifiers
        const ballModifiers: Record<string, number> = {
            "poke-ball": 1,
            "great-ball": 1.5,
            "ultra-ball": 2,
            "master-ball": 255, // Guaranteed catch
        };
        const ballModifier = ballModifiers[ballType] || 1;

        // Status Modifiers
        const statusModifiers: Record<string, number> = {
            "none": 1,
            "sleep": 2,
            "freeze": 2,
            "paralysis": 1.5,
            "poison": 1.5,
            "burn": 1.5,
        };
        const statusModifier = statusModifiers[statusCondition] || 1;

        const a = (((3 * maxHP - 2 * currentHP) * captureRate * ballModifier) / (3 * maxHP)) * statusModifier;

        if (a >= 255 || ballType === "master-ball") {
            return { probability: 100, message: "A guaranteed catch!" };
        }

        // The probability is roughly (a/255) ^ 0.75 for 4 shakes, but (a/255) is more intuitive for users
        // Let's provide a percentage based on 'a'
        const probability = Math.min(100, Math.round((a / 255) * 100));

        let insight = "";
        if (probability > 80) insight = "Looking good! You have a very high chance.";
        else if (probability > 50) insight = "Pretty decent odds. Go for it!";
        else if (probability > 20) insight = "It might take a few tries. Consider lowering its HP more.";
        else insight = "Tough catch! Try using a better ball or a status condition.";

        return {
            probability,
            insight
        };
    } catch (error) {
        console.error("Error calculating catch probability:", error);
        return { error: "Failed to calculate probability" };
    }
}
