import { createRoot, onCleanup, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';

import { attachKeydownEventListener } from '@/utils';

import { calculateBenchmark } from './helpers';
import { type DebugInfo } from './types';

export type DebugInfoStore = Readonly<{
    state: DebugInfo & {
        isDebugging: boolean;
    };
    cleanup?: () => void;
    resetMetrics: () => void;
    reset: () => void;
    addChatItemEleWidthMetric(value: number): void;
    addProcessXhrMetric(value: number): void;
    addProcessChatEventMetric(value: number): void;
    addLiveChatDelay(ms: number): void;
    updateProcessChatEventQueueLength(queueLength: number): void;
    addOutdatedRemovedChatEventCount(count: number): void;
    addCleanedChatItemCount(count: number): void;
}>;

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
    const [state, setState] = createStore<
        DebugInfo & {
            isDebugging: boolean;
        }
    >({ ...DEFAULT_DEBUG_INFO, isDebugging: false });

    function toggleIsDebugging() {
        setState('isDebugging', (s) => !s);
    }

    function resetMetrics() {
        setState({ ...DEFAULT_DEBUG_INFO, isDebugging: false });
    }

    function reset() {
        resetMetrics();
        setState('isDebugging', false);
    }

    function addChatItemEleWidthMetric(value: number) {
        setState('getChatItemEleWidthBenchmark', (s) =>
            calculateBenchmark(s, value * 1000),
        );
    }

    function addProcessXhrMetric(value: number) {
        setState('processXhrBenchmark', (s) =>
            calculateBenchmark(s, value * 1000),
        );
    }

    function addProcessChatEventMetric(value: number) {
        setState('processChatEventBenchmark', (s) =>
            calculateBenchmark(s, value * 1000),
        );
    }

    function addLiveChatDelay(ms: number) {
        setState('liveChatDelay', (s) => calculateBenchmark(s, ms / 1000));
    }

    function updateProcessChatEventQueueLength(queueLength: number) {
        setState('processChatEventQueueLength', queueLength);
    }

    function addOutdatedRemovedChatEventCount(count: number) {
        setState('outdatedRemovedChatEventCount', (s) => s + count);
    }

    function addCleanedChatItemCount(count: number) {
        setState('cleanedChatItemCount', (s) => s + count);
    }

    let cleanup: (() => void) | undefined;

    createRoot((dispose) => {
        onMount(() => {
            const disposeKeyboardListener = attachKeydownEventListener({
                withAlt: true,
                withCtrl: true,
                key: 'd',
                domToAttach: document.body,
                callback: toggleIsDebugging,
            });
            onCleanup(() => {
                disposeKeyboardListener();
            });
        });

        cleanup = dispose;
    });

    return {
        state,
        cleanup,
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
