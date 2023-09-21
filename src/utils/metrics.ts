type BenchmarkResult<T> = {
    result: T;
    runtime?: number;
};

export type Metrics = {
    min: number;
    max: number;
    avg: number;
    count: number;
    latest: number;
};

export function benchmarkRuntime<T>(
    callback: () => T,
    isDebugging: boolean,
): BenchmarkResult<T> {
    const beforeTime = isDebugging ? performance.now() : 0;

    const result = callback();

    return {
        result,
        runtime: isDebugging ? performance.now() - beforeTime : undefined,
    };
}

export async function benchmarkRuntimeAsync<T>(
    callback: () => Promise<T>,
    isDebugging: boolean,
): Promise<BenchmarkResult<T>> {
    const beforeTime = isDebugging ? performance.now() : 0;

    const result = await callback();

    return {
        result,
        runtime: isDebugging ? performance.now() - beforeTime : undefined,
    };
}

export function updateMetrics(oldMetrics: Metrics, newValue: number): Metrics {
    const newCount = oldMetrics.count + 1;
    return {
        min: Math.min(oldMetrics.min, newValue),
        max: Math.max(oldMetrics.max, newValue),
        avg: (oldMetrics.avg * oldMetrics.count + newValue) / newCount,
        count: newCount,
        latest: newValue,
    };
}
