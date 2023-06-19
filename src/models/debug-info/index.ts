import { makeAutoObservable } from 'mobx';

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

export class DebugInfoModel implements DebugInfo {
    getChatItemEleWidthBenchmark =
        DEFAULT_DEBUG_INFO.getChatItemEleWidthBenchmark;

    processXhrBenchmark = DEFAULT_DEBUG_INFO.processXhrBenchmark;

    processChatEventBenchmark = DEFAULT_DEBUG_INFO.processChatEventBenchmark;

    processChatEventQueueLength =
        DEFAULT_DEBUG_INFO.processChatEventQueueLength;

    outdatedRemovedChatEventCount =
        DEFAULT_DEBUG_INFO.outdatedRemovedChatEventCount;

    cleanedChatItemCount = DEFAULT_DEBUG_INFO.cleanedChatItemCount;

    liveChatDelay = DEFAULT_DEBUG_INFO.liveChatDelay;

    constructor() {
        makeAutoObservable(this);
    }

    addChatItemEleWidthMetric(value: number) {
        this.getChatItemEleWidthBenchmark = calculateBenchmark(
            this.getChatItemEleWidthBenchmark,
            value * 1000,
        );
    }

    addProcessXhrMetric(value: number) {
        this.processXhrBenchmark = calculateBenchmark(
            this.processXhrBenchmark,
            value * 1000,
        );
    }

    addProcessChatEventMetric(value: number) {
        this.processChatEventBenchmark = calculateBenchmark(
            this.processChatEventBenchmark,
            value * 1000,
        );
    }

    addLiveChatDelay(ms: number) {
        this.liveChatDelay = calculateBenchmark(this.liveChatDelay, ms / 1000);
    }

    updateProcessChatEventQueueLength(queueLength: number) {
        this.processChatEventQueueLength = queueLength;
    }

    addOutdatedRemovedChatEventCount(count: number) {
        this.outdatedRemovedChatEventCount += count;
    }

    addCleanedChatItemCount(count: number) {
        this.cleanedChatItemCount += count;
    }

    reset() {
        Object.assign(this, { ...DEFAULT_DEBUG_INFO });
    }
}
