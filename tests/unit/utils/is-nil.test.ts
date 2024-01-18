import { describe, it, expect } from 'vitest';

import { isNil } from '@/utils';

type TestParameters = {
    input: any;
    expected: boolean;
};

describe('isNil', () => {
    describe.each`
        input        | expected
        ${null}      | ${true}
        ${undefined} | ${true}
        ${NaN}       | ${false}
        ${false}     | ${false}
        ${0}         | ${false}
        ${''}        | ${false}
    `('when the input is $input', (params: TestParameters) => {
        it(`should return ${params.expected}`, () => {
            expect(isNil(params.input)).toBe(params.expected);
        });
    });
});
