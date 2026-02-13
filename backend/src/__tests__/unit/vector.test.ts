import { cosineSimilarity, dotProduct, magnitude } from '../../lib/vector.js';

describe('Vector Math', () => {
    describe('magnitude', () => {
        it('should calculate magnitude correctly', () => {
            expect(magnitude([3, 4])).toBe(5); // 3-4-5 triangle
            expect(magnitude([1, 0, 0])).toBe(1);
            expect(magnitude([0, 0, 0])).toBe(0);
        });
    });

    describe('dotProduct', () => {
        it('should calculate dot product correctly', () => {
            expect(dotProduct([1, 2], [3, 4])).toBe(11); // 1*3 + 2*4 = 3 + 8 = 11
            expect(dotProduct([1, 0], [0, 1])).toBe(0); // Orthogonal
        });

        it('should throw error for mismatched lengths', () => {
            expect(() => dotProduct([1], [1, 2])).toThrow();
        });
    });

    describe('cosineSimilarity', () => {
        it('should return 1 for identical vectors', () => {
            expect(cosineSimilarity([1, 2, 3], [1, 2, 3])).toBeCloseTo(1);
        });

        it('should return 0 for orthogonal vectors', () => {
            expect(cosineSimilarity([1, 0], [0, 1])).toBe(0);
        });

        it('should return -1 for opposite vectors', () => {
            expect(cosineSimilarity([1, 1], [-1, -1])).toBeCloseTo(-1);
        });

        it('should handle zero vectors gracefully', () => {
            expect(cosineSimilarity([0, 0], [1, 1])).toBe(0);
        });

        it('should calculate specific similarity correctly', () => {
            // A = [1, 0], B = [1, 1]
            // Dot = 1
            // MagA = 1, MagB = sqrt(2)
            // Sim = 1 / sqrt(2) = 0.707
            expect(cosineSimilarity([1, 0], [1, 1])).toBeCloseTo(0.7071);
        });
    });
});
