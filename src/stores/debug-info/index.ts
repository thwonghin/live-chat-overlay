import { attachKeydownEventListener } from '@/utils';
import { createStore } from 'solid-js/store';
import { onCleanup } from 'solid-js';
import { DebugInfo } from './types';
import { calculateBenchmark } from './helpers';

export type DebugInfoStoreValues = {
    isDebugging: boolean;
    debugInfo: DebugInfo;
};

export type DebugInfoStore = {
    init: () => void;
    resetMetrics: () => void;
    reset: () => void;
    addChatItemEleWidthMetric(value: number): void;
    addProcessXhrMetric(value: number): void;
    addProcessChatEventMetric(value: number): void;
    addLiveChatDelay(ms: number): void;
    updateProcessChatEventQueueLength(queueLength: number): void;
    addOutdatedRemovedChatEventCount(count: number): void;
    addCleanedChatItemCount(count: number): void;
} & DebugInfoStoreValues;

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

export const createDebugInfoStore = (): DebugInfoStore => {
    const [state, setState] = createStore<DebugInfoStoreValues>({
        isDebugging: false,
        debugInfo: { ...DEFAULT_DEBUG_INFO },
    });

    function toggleIsDebugging() {
        setState('isDebugging', (s) => !s);
    }

    function resetMetrics() {
        setState('debugInfo', { ...DEFAULT_DEBUG_INFO });
    }

    function reset() {
        resetMetrics();
        setState('isDebugging', false);
    }

    function addChatItemEleWidthMetric(value: number) {
        setState('debugInfo', 'getChatItemEleWidthBenchmark', (s) =>
            calculateBenchmark(s, value * 1000),
        );
    }

    function addProcessXhrMetric(value: number) {
        setState('debugInfo', 'processXhrBenchmark', (s) =>
            calculateBenchmark(s, value * 1000),
        );
    }

    function addProcessChatEventMetric(value: number) {
        setState('debugInfo', 'processChatEventBenchmark', (s) =>
            calculateBenchmark(s, value * 1000),
        );
    }

    function addLiveChatDelay(ms: number) {
        setState('debugInfo', 'liveChatDelay', (s) =>
            calculateBenchmark(s, ms / 1000),
        );
    }

    function updateProcessChatEventQueueLength(queueLength: number) {
        setState('debugInfo', 'processChatEventQueueLength', queueLength);
    }

    function addOutdatedRemovedChatEventCount(count: number) {
        setState(
            'debugInfo',
            'outdatedRemovedChatEventCount',
            (s) => s + count,
        );
    }

    function addCleanedChatItemCount(count: number) {
        setState('debugInfo', 'cleanedChatItemCount', (s) => s + count);
    }

    function init() {
        const disposeKeyboardListener = attachKeydownEventListener({
            withAlt: true,
            withCtrl: true,
            key: 'd',
            domToAttach: window.parent.document.body,
            callback: toggleIsDebugging,
        });
        onCleanup(() => {
            disposeKeyboardListener();
        });
    }

    return {
        ...state,
        init,
        resetMetrics,
        reset,
        addChatItemEleWidthMetric,
        addProcessXhrMetric,
        addProcessChatEventMetric,
        addLiveChatDelay,
        updateProcessChatEventQueueLength,
        addOutdatedRemovedChatEventCount,
        addCleanedChatItemCount,
    };
};
