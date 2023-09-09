import { calculateBenchmark } from './helpers';
import type { DebugInfo } from './types';

const DEFAULT_DEBUG_INFO: Readonly<DebugInfo> = Object.freeze({
    getChatItemEleWidthBenchmark: {
        min: Number.MAX_SAFE_INTEGER,
        max: 0,
        avg: 0,
        count: 0,
        latest: 0,
    },
    processXhrBenchmark: {
        min: Number.MAX_SAFE_INTEGER,
        max: 0,
        avg: 0,
        count: 0,
        latest: 0,
    },
    processChatEventBenchmark: {
        min: Number.MAX_SAFE_INTEGER,
        max: 0,
        avg: 0,
        count: 0,
        latest: 0,
    },
    processChatEventQueueLength: 0,
    outdatedRemovedChatEventCount: 0,
    cleanedChatItemCount: 0,
    liveChatDelay: {
        min: Number.MAX_SAFE_INTEGER,
        max: 0,
        avg: 0,
        count: 0,
        latest: 0,
    },
});

export type DebugInfoModel = {
    addChatItemEleWidthMetric(value: number): void;
    addProcessXhrMetric(value: number): void;
    addProcessChatEventMetric(value: number): void;
    addLiveChatDelay(ms: number): void;
    updateProcessChatEventQueueLength(queueLength: number): void;
    addOutdatedRemovedChatEventCount(count: number): void;
    addCleanedChatItemCount(count: number): void;
    reset(): void;
} & DebugInfo;

export const createDebugInfoModel = (): DebugInfoModel => {
    const debugInfoModel = {
        ...DEFAULT_DEBUG_INFO,
        addChatItemEleWidthMetric(value: number) {
            debugInfoModel.getChatItemEleWidthBenchmark = calculateBenchmark(
                debugInfoModel.getChatItemEleWidthBenchmark,
                value * 1000,
            );
        },

        addProcessXhrMetric(value: number) {
            debugInfoModel.processXhrBenchmark = calculateBenchmark(
                debugInfoModel.processXhrBenchmark,
                value * 1000,
            );
        },

        addProcessChatEventMetric(value: number) {
            debugInfoModel.processChatEventBenchmark = calculateBenchmark(
                debugInfoModel.processChatEventBenchmark,
                value * 1000,
            );
        },

        addLiveChatDelay(ms: number) {
            debugInfoModel.liveChatDelay = calculateBenchmark(
                debugInfoModel.liveChatDelay,
                ms / 1000,
            );
        },

        updateProcessChatEventQueueLength(queueLength: number) {
            debugInfoModel.processChatEventQueueLength = queueLength;
        },

        addOutdatedRemovedChatEventCount(count: number) {
            debugInfoModel.outdatedRemovedChatEventCount += count;
        },

        addCleanedChatItemCount(count: number) {
            debugInfoModel.cleanedChatItemCount += count;
        },

        reset() {
            Object.assign(debugInfoModel, { ...DEFAULT_DEBUG_INFO });
        },
    };

    return debugInfoModel;
};
