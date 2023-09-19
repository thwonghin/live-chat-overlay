import { describe, it, vi, expect } from 'vitest';

import { catchWithFallback } from '@/utils';

describe('catchWithFallback', () => {
    describe('when the func does not throw error', () => {
        it('should return func returned value', async () => {
            const fn = vi.fn().mockResolvedValue('resolve');

            const result = await catchWithFallback(fn, 'fallback');

            expect(result).toBe('resolve');
        });
    });

    describe('when the func throws error', () => {
        it('should return func returned value', async () => {
            const fn = vi.fn().mockRejectedValue('reject');

            const result = await catchWithFallback(fn, 'fallback');

            expect(result).toBe('fallback');
        });
    });
});
