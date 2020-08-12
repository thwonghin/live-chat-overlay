import { mapValues } from 'lodash-es';

import { calculateBenchmark } from '@/features/debug-info/helpers';
import type { Benchmark } from '@/features/debug-info';

interface TestParams {
    condition: string;
    min: number;
    max: number;
    avg: number;
    count: number;
    nextMin: number;
    nextMax: number;
    nextAvg: number;
    nextCount: number;
    value: number;
}

describe('calculateBenchmark', () => {
    describe.each`
        condition                                      | min                        | max    | avg   | count | value  | nextMin | nextMax | nextAvg  | nextCount
        ${'when it is from initial state'}             | ${Number.MAX_SAFE_INTEGER} | ${0}   | ${0}  | ${0}  | ${10}  | ${10}   | ${10}   | ${10}    | ${1}
        ${'when it consume value between min and max'} | ${12}                      | ${100} | ${50} | ${20} | ${30}  | ${12}   | ${100}  | ${49.05} | ${21}
        ${'when it consume value less than min'}       | ${12}                      | ${100} | ${50} | ${20} | ${2}   | ${2}    | ${100}  | ${47.71} | ${21}
        ${'when it consume value more than max'}       | ${12}                      | ${100} | ${50} | ${20} | ${200} | ${12}   | ${200}  | ${57.14} | ${21}
    `('$condition', (params: TestParams) => {
        it('should return correct result', () => {
            const nowBenchmark: Benchmark = {
                min: params.min,
                max: params.max,
                avg: params.avg,
                count: params.count,
            };

            const expectedResult: Benchmark = {
                min: params.nextMin,
                max: params.nextMax,
                avg: params.nextAvg,
                count: params.nextCount,
            };

            const result = calculateBenchmark(nowBenchmark, params.value);

            expect(mapValues(result, (value) => value.toFixed(2))).toEqual(
                mapValues(expectedResult, (value) => value.toFixed(2)),
            );
        });
    });
});
