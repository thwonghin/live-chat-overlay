export interface Benchmark {
    min: number;
    max: number;
    avg: number;
    count: number;
}

export interface State {
    isDebugging: boolean;
    processXhrBenchmark: Benchmark;
    processChatEventBenchmark: Benchmark;
    processXhrQueueLength: number;
    processChatEventQueueLength: number;
}
