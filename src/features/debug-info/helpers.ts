import {Benchmark} from './types';

export function calculateBenchmark(
    oldBenchmark: Benchmark,
    newValue: number,
): Benchmark {
    const newCount = oldBenchmark.count + 1;
    return {
        min: Math.min(oldBenchmark.min, newValue),
        max: Math.max(oldBenchmark.max, newValue),
        avg: (oldBenchmark.avg * oldBenchmark.count + newValue) / newCount,
        count: newCount,
    };
}
