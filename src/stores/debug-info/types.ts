export type Benchmark = {
    min: number;
    max: number;
    avg: number;
    count: number;
    latest: number;
};

export type DebugInfo = {
    getChatItemEleWidthBenchmark: Benchmark;
    processXhrBenchmark: Benchmark;
    processChatEventBenchmark: Benchmark;
    processChatEventQueueLength: number;
    outdatedRemovedChatEventCount: number;
    cleanedChatItemCount: number;
    liveChatDelay: Benchmark;
};
