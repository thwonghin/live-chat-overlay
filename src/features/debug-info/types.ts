export type Benchmark = {
    min: number;
    max: number;
    avg: number;
    count: number;
};

export type State = {
    isDebugging: boolean;
    getChatItemEleWidthBenchmark: Benchmark;
    processXhrBenchmark: Benchmark;
    processChatEventBenchmark: Benchmark;
    processChatEventQueueLength: number;
    outdatedRemovedChatEventCount: number;
};
