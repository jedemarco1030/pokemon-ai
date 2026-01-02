import { getEffectiveness, calculateDamage } from '@/lib/battle/utils';

describe('Battle Utilities', () => {
    describe('getEffectiveness', () => {
        it('should return 2 for super effective moves', () => {
            expect(getEffectiveness('fire', ['grass'])).toBe(2);
            expect(getEffectiveness('water', ['fire'])).toBe(2);
            expect(getEffectiveness('electric', ['water'])).toBe(2);
        });

        it('should return 0.5 for not very effective moves', () => {
            expect(getEffectiveness('fire', ['water'])).toBe(0.5);
            expect(getEffectiveness('water', ['grass'])).toBe(0.5);
            expect(getEffectiveness('grass', ['fire'])).toBe(0.5);
        });

        it('should return 0 for ineffective moves', () => {
            expect(getEffectiveness('electric', ['ground'])).toBe(0);
            expect(getEffectiveness('normal', ['ghost'])).toBe(0);
            expect(getEffectiveness('poison', ['steel'])).toBe(0);
        });

        it('should handle dual types correctly', () => {
            // Water is 2x against Charizard (Fire/Flying)
            expect(getEffectiveness('water', ['fire', 'flying'])).toBe(2);
            // Electric is 2x against Charizard (Fire/Flying)
            expect(getEffectiveness('electric', ['fire', 'flying'])).toBe(2);
            // Grass is 0.25x against Charizard (Fire/Flying)
            expect(getEffectiveness('grass', ['fire', 'flying'])).toBe(0.25);
            // Rock is 4x against Charizard (Fire/Flying)
            expect(getEffectiveness('rock', ['fire', 'flying'])).toBe(4);
        });

        it('should return 1 for unknown types or neutral matchups', () => {
            expect(getEffectiveness('normal', ['normal'])).toBe(1);
            expect(getEffectiveness('unknown', ['fire'])).toBe(1);
        });
    });

    describe('calculateDamage', () => {
        it('should calculate damage within expected range', () => {
            const damage = calculateDamage(100, 100, 40, 1);
            // baseDamage = (((2 * 50 / 5 + 2) * 40 * (100 / 100)) / 50 + 2)
            // baseDamage = (((22) * 40 * 1) / 50 + 2)
            // baseDamage = (880 / 50 + 2)
            // baseDamage = 17.6 + 2 = 19.6
            // With random modifier (0.85 to 1.0): 16.66 to 19.6
            expect(damage).toBeGreaterThanOrEqual(16);
            expect(damage).toBeLessThanOrEqual(20);
        });

        it('should apply effectiveness multiplier correctly', () => {
            const damage = calculateDamage(100, 100, 40, 2);
            // 19.6 * 2 = 39.2
            // With random modifier (0.85 to 1.0): 33.32 to 39.2
            expect(damage).toBeGreaterThanOrEqual(33);
            expect(damage).toBeLessThanOrEqual(40);
        });

        it('should return 0 damage if effectiveness is 0', () => {
            const damage = calculateDamage(100, 100, 40, 0);
            expect(damage).toBe(0);
        });
    });
});
