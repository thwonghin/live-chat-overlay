import { noop } from 'lodash-es';
import { createRoot, onCleanup, onMount } from 'solid-js';
import { type SetStoreFunction, createStore } from 'solid-js/store';

import { attachKeydownEventListener } from '@/utils';
import { updateMetrics } from '@/utils/metrics';

import { type DebugInfo } from './types';

const DEFAULT_DEBUG_INFO: Readonly<DebugInfo> = Object.freeze({
    getChatItemEleWidthMetrics: {
        min: Number.MAX_SAFE_INTEGER,
        max: 0,
        avg: 0,
        count: 0,
        latest: 0,
    },
    processXhrMetrics: {
        min: Number.MAX_SAFE_INTEGER,
        max: 0,
        avg: 0,
        count: 0,
        latest: 0,
    },
    processChatEventMetrics: {
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

type DebugInfoStoreState = DebugInfo & {
    isDebugging: boolean;
};

export class DebugInfoStore {
    cleanup = noop;
    state: DebugInfoStoreState;
    private readonly setState: SetStoreFunction<DebugInfoStoreState>;

    constructor() {
        const [state, setState] = createStore<
            DebugInfo & {
                isDebugging: boolean;
            }
        >({ ...DEFAULT_DEBUG_INFO, isDebugging: false });
        // eslint-disable-next-line solid/reactivity
        this.state = state;
        this.setState = setState;
    }

    init() {
        this.attachReactiveContext();
    }

    resetMetrics() {
        this.setState({ ...DEFAULT_DEBUG_INFO, isDebugging: false });
    }

    reset() {
        this.resetMetrics();
        this.setState('isDebugging', false);
    }

    addChatItemEleWidthBenchmark(value: number) {
        this.setState('getChatItemEleWidthMetrics', (s) =>
            updateMetrics(s, value * 1000),
        );
    }

    addProcessXhrBenchmark(value: number) {
        this.setState('processXhrMetrics', (s) =>
            updateMetrics(s, value * 1000),
        );
    }

    addProcessChatEventBenchmark(value: number) {
        this.setState('processChatEventMetrics', (s) =>
            updateMetrics(s, value * 1000),
        );
    }

    addLiveChatDelay(ms: number) {
        this.setState('liveChatDelay', (s) => updateMetrics(s, ms / 1000));
    }

    updateProcessChatEventQueueLength(queueLength: number) {
        this.setState('processChatEventQueueLength', queueLength);
    }

    addOutdatedRemovedChatEventCount(count: number) {
        this.setState('outdatedRemovedChatEventCount', (s) => s + count);
    }

    addCleanedChatItemCount(count: number) {
        this.setState('cleanedChatItemCount', (s) => s + count);
    }

    private readonly toggleIsDebugging = () => {
        this.setState('isDebugging', (s) => !s);
    };

    private attachReactiveContext() {
        createRoot((dispose) => {
            onMount(() => {
                const disposeKeyboardListener = attachKeydownEventListener({
                    withAlt: true,
                    withCtrl: true,
                    key: 'd',
                    domToAttach: document.body,
                    callback: this.toggleIsDebugging,
                });
                onCleanup(() => {
                    disposeKeyboardListener();
                });
            });

            this.cleanup = dispose;
        });
    }
}
