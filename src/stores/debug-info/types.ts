import { type Metrics } from '@/utils/metrics';

export type DebugInfo = {
    getChatItemEleWidthMetrics: Metrics;
    processXhrMetrics: Metrics;
    processChatEventMetrics: Metrics;
    processChatEventQueueLength: number;
    outdatedRemovedChatEventCount: number;
    cleanedChatItemCount: number;
    liveChatDelay: Metrics;
};
