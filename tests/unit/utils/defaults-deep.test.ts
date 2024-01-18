import { describe, it, expect } from 'vitest';

import { defaultsDeep } from '@/utils';

type TestParameters = {
    values: any;
    expected: any;
};

const defaultValues = {
    p1: 'test',
    p2: {
        nested_p: 'test',
        nested_p2: {
            nested_p3: [],
            nested_p4: 1000,
        },
    },
    p3: 100,
    p4: null,
};

describe('defaultsDeep', () => {
    describe.each`
        condition                                | values                                                                  | expected
        ${'when the object is flat'}             | ${{ p3: 10 }}                                                           | ${{ p1: 'test', p2: { nested_p: 'test', nested_p2: { nested_p3: [], nested_p4: 1000 } }, p3: 10, p4: null }}
        ${'when the object has array attribute'} | ${{ p4: [] }}                                                           | ${{ p1: 'test', p2: { nested_p: 'test', nested_p2: { nested_p3: [], nested_p4: 1000 } }, p3: 100, p4: [] }}
        ${'when the object has boolean value'}   | ${{ p2: false }}                                                        | ${{ p1: 'test', p2: false, p3: 100, p4: null }}
        ${'when the object has null value'}      | ${{ p2: null }}                                                         | ${{ p1: 'test', p2: null, p3: 100, p4: null }}
        ${'when the object has undefined value'} | ${{ p2: undefined }}                                                    | ${defaultValues}
        ${'when it is nested'}                   | ${{ p2: { nested_p: 'a key', nested_p2: { nested_p3: ['a value'] } } }} | ${{ p1: 'test', p2: { nested_p: 'a key', nested_p2: { nested_p3: ['a value'], nested_p4: 1000 } }, p3: 100, p4: null }}
    `(`when $condition`, (params: TestParameters) => {
        it(`should return correctly`, () => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            expect(defaultsDeep(params.values, defaultValues)).toStrictEqual(
                params.expected,
            );
        });
    });

    describe('when one of the default is a function', () => {
        it('should work without crashing', () => {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            const defaults = { set() {} };
            const result = defaultsDeep({}, defaults);
            expect(result.set).toBe(defaults.set);
        });
    });
});
