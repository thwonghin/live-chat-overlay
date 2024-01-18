import { describe, it, expect } from 'vitest';

import { clamp } from '@/utils';

type TestParameters = {
    min: number;
    max: number;
    expected: boolean;
};

const value = 10;

describe('clamp', () => {
    describe.each`
        min      | max      | expected
        ${-1}    | ${1}     | ${1}
        ${-1}    | ${100}   | ${10}
        ${11}    | ${100}   | ${11}
        ${-1}    | ${-1}    | ${-1}
        ${100}   | ${100}   | ${100}
        ${value} | ${value} | ${value}
    `(
        `when min is $min and max is $max given value = ${value}`,
        (params: TestParameters) => {
            it(`should return ${params.expected}`, () => {
                expect(clamp(value, params.min, params.max)).toBe(
                    params.expected,
                );
            });
        },
    );
});
