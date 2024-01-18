import { createRoot, onCleanup, onMount } from 'solid-js';
import { type SetStoreFunction, createStore } from 'solid-js/store';

import { attachKeydownEventListener, noop } from '@/utils';
import { updateMetrics } from '@/utils/metrics';

import { type DebugInfo } from './types';

const getDefaultDebugInfo = (): Readonly<DebugInfo> =>
    Object.freeze({
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
        enqueuedChatItemCount: 0,
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
        debugStartTimeMs: 0,
        lastEventTimeMs: 0,
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
        >({ ...getDefaultDebugInfo(), isDebugging: false });
        // eslint-disable-next-line solid/reactivity
        this.state = state;
        this.setState = setState;
    }

    init() {
        this.attachReactiveContext();
    }

    resetMetrics() {
        this.setState(getDefaultDebugInfo());
    }

    addProcessXhrBenchmark(value: number) {
        this.setState('processXhrMetrics', (s) =>
            updateMetrics(s, value * 1000),
        );
        this.updateLastEventTime();
    }

    addProcessChatEventBenchmark(value: number) {
        this.setState('processChatEventMetrics', (s) =>
            updateMetrics(s, value * 1000),
        );
        this.updateLastEventTime();
    }

    addLiveChatDelay(ms: number) {
        this.setState('liveChatDelay', (s) => updateMetrics(s, ms / 1000));
        this.updateLastEventTime();
    }

    addEnqueueChatItemCount(count: number) {
        this.setState('enqueuedChatItemCount', (s) => s + count);
        this.updateLastEventTime();
    }

    updateProcessChatEventQueueLength(queueLength: number) {
        this.setState('processChatEventQueueLength', queueLength);
        this.updateLastEventTime();
    }

    addOutdatedRemovedChatEventCount(count: number) {
        this.setState('outdatedRemovedChatEventCount', (s) => s + count);
        this.updateLastEventTime();
    }

    addCleanedChatItemCount(count: number) {
        this.setState('cleanedChatItemCount', (s) => s + count);
        this.updateLastEventTime();
    }

    private updateLastEventTime() {
        this.setState('lastEventTimeMs', performance.now());
    }

    private readonly toggleIsDebugging = () => {
        this.setState((s) => {
            const newIsDebugging = !s.isDebugging;

            if (!newIsDebugging) {
                return {
                    ...getDefaultDebugInfo(),
                    isDebugging: newIsDebugging,
                };
            }

            return {
                isDebugging: newIsDebugging,
                debugStartTimeMs: performance.now(),
            };
        });
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
