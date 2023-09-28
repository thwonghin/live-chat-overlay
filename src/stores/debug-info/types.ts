import { type Metrics } from '@/utils/metrics';

export type DebugInfo = {
    processXhrMetrics: Metrics;
    processChatEventMetrics: Metrics;
    processChatEventQueueLength: number;
    enqueuedChatItemCount: number;
    outdatedRemovedChatEventCount: number;
    cleanedChatItemCount: number;
    liveChatDelay: Metrics;
    debugStartTimeMs: number;
    lastEventTimeMs: number;
};
