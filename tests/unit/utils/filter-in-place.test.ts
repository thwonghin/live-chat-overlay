import { isNil } from 'lodash-es';

import { filterInPlace } from '@/utils';

const PREDICATE_EVEN = (item: number) => item % 2 === 0;
// eslint-disable-next-line @typescript-eslint/ban-types
const PREDICATE_IS_NOT_NIL = (item: number | null | undefined) => !isNil(item);

type TestParams = {
    array: any[];
    predicate: (item: any) => boolean;
    result: any[];
};

describe('filterInPlace', () => {
    describe.each`
        description                      | array                    | predicate               | result
        ${'simple predicate'}            | ${[0, 1, 2, 3, 4, 5, 6]} | ${PREDICATE_EVEN}       | ${[0, 2, 4, 6]}
        ${'predicate involve undefined'} | ${[0, undefined, null]}  | ${PREDICATE_IS_NOT_NIL} | ${[0]}
    `('$description', (testParams: TestParams) => {
        it('should update correctly', () => {
            filterInPlace(testParams.array, testParams.predicate);

            expect(testParams.array).toEqual(testParams.result);
        });
    });
});
