import { describe, it, expect } from 'vitest';

import { mapValues } from '@/utils';
import { updateMetrics, type Metrics } from '@/utils/metrics';

type TestParameters = {
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
};

describe('calculateMetrics', () => {
    describe.each`
        condition                                      | min                        | max    | avg   | count | value  | nextMin | nextMax | nextAvg  | nextCount
        ${'when it is from initial state'}             | ${Number.MAX_SAFE_INTEGER} | ${0}   | ${0}  | ${0}  | ${10}  | ${10}   | ${10}   | ${10}    | ${1}
        ${'when it consume value between min and max'} | ${12}                      | ${100} | ${50} | ${20} | ${30}  | ${12}   | ${100}  | ${49.05} | ${21}
        ${'when it consume value less than min'}       | ${12}                      | ${100} | ${50} | ${20} | ${2}   | ${2}    | ${100}  | ${47.71} | ${21}
        ${'when it consume value more than max'}       | ${12}                      | ${100} | ${50} | ${20} | ${200} | ${12}   | ${200}  | ${57.14} | ${21}
    `('$condition', (parameters: TestParameters) => {
        it('should return correct result', () => {
            const nowMetrics: Metrics = {
                min: parameters.min,
                max: parameters.max,
                avg: parameters.avg,
                count: parameters.count,
                latest: parameters.value,
            };

            const expectedResult: Metrics = {
                min: parameters.nextMin,
                max: parameters.nextMax,
                avg: parameters.nextAvg,
                count: parameters.nextCount,
                latest: parameters.value,
            };

            const result = updateMetrics(nowMetrics, parameters.value);

            expect(mapValues(result, (value) => value.toFixed(2))).toEqual(
                mapValues(expectedResult, (value) => value.toFixed(2)),
            );
        });
    });
});
