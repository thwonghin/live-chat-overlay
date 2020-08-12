export interface Benchmark {
    min: number;
    max: number;
    avg: number;
    count: number;
}

export interface State {
    isDebugging: boolean;
    getChatItemEleWidthBenchmark: Benchmark;
    processXhrBenchmark: Benchmark;
    processChatEventBenchmark: Benchmark;
    processXhrQueueLength: number;
    processChatEventQueueLength: number;
    outdatedRemovedChatEventCount: number;
}
