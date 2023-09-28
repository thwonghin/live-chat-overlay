import { type Component, For, Index, Show } from 'solid-js';

import { useStore } from '@/contexts/root-store';
import type { Metrics } from '@/utils/metrics';

import styles from './index.module.scss';

type RoundedMetrics = Readonly<{
    min: string;
    max: string;
    avg: string;
    count: number;
    latest: string;
}>;

function roundMetrics(metrics: Metrics): RoundedMetrics {
    return {
        min: metrics.min.toFixed(2),
        max: metrics.max.toFixed(2),
        avg: metrics.avg.toFixed(2),
        count: metrics.count,
        latest: metrics.latest.toFixed(2),
    };
}

function renderMetrics(metrics: RoundedMetrics): string[] {
    return [
        `min: ${metrics.min}, max: ${metrics.max}`,
        `avg: ${metrics.avg}, count: ${metrics.count}`,
        `latest: ${metrics.latest}`,
    ];
}

type DebugOverlayLayoutProps = Readonly<{
    chatItemsCountByLineNumber: Record<number, number>;
    processXhrMetrics: RoundedMetrics;
    enqueuedChatItemCount: number;
    processChatEventMetrics: RoundedMetrics;
    processChatEventQueueLength: number;
    outdatedRemovedChatEventCount: number;
    cleanedChatItemCount: number;
    liveChatDelay: RoundedMetrics;
    debugIntervalInSeconds: number;
}>;

export const DebugOverlayLayout: Component<DebugOverlayLayoutProps> = (
    props,
) => {
    const cleanSpeed = () =>
        props.cleanedChatItemCount / props.debugIntervalInSeconds;
    const enqueueSpeed = () =>
        props.enqueuedChatItemCount / props.debugIntervalInSeconds;
    const dequeueSpeed = () =>
        props.processChatEventMetrics.count / props.debugIntervalInSeconds;

    return (
        <>
            <div class={styles['debug-container']}>
                <p class={styles['debug-text']}>Message Count By Position:</p>
                <For each={Object.entries(props.chatItemsCountByLineNumber)}>
                    {([lineNumber, count]) => (
                        <p class={styles['debug-text']}>{`${
                            Number(lineNumber) + 1
                        }: ${count}`}</p>
                    )}
                </For>
                <br />
                <p class={styles['debug-text']}>Enqueue Speed:</p>
                <p class={styles['debug-text']}>{enqueueSpeed()}</p>
                <p class={styles['debug-text']}>Dequeue Speed:</p>
                <p class={styles['debug-text']}>{dequeueSpeed()}</p>
                <p class={styles['debug-text']}>Clean Speed:</p>
                <p class={styles['debug-text']}>{cleanSpeed()}</p>
            </div>
            <div class={styles['metrics-container']}>
                <Show when={props.processXhrMetrics.count !== 0}>
                    <p class={styles['debug-text']}>
                        Process response metrics (μs):
                    </p>
                    <Index each={renderMetrics(props.processXhrMetrics)}>
                        {(item) => <p class={styles['debug-text']}>{item()}</p>}
                    </Index>
                </Show>
                <br />
                <p class={styles['debug-text']}>
                    {`Response Chat Event Queue Length: ${props.processChatEventQueueLength}`}
                </p>
                <Show when={props.processChatEventMetrics.count !== 0}>
                    <p class={styles['debug-text']}>
                        Process chat event metrics (μs):
                    </p>
                    <Index each={renderMetrics(props.processChatEventMetrics)}>
                        {(item) => <p class={styles['debug-text']}>{item()}</p>}
                    </Index>
                </Show>
                <br />
                <p class={styles['debug-text']}>
                    {`Removed Outdated Chat Event: ${props.outdatedRemovedChatEventCount}`}
                </p>
                <Show when={props.liveChatDelay.count !== 0}>
                    <p class={styles['debug-text']}>Live Chat Delay (s):</p>
                    <Index each={renderMetrics(props.liveChatDelay)}>
                        {(item) => <p class={styles['debug-text']}>{item()}</p>}
                    </Index>
                </Show>
                <p class={styles['debug-text']}>
                    {`Cleaned Chat Item: ${props.cleanedChatItemCount}`}
                </p>
            </div>
        </>
    );
};

const DebugOverlay: Component = () => {
    const store = useStore();

    const chatItemsCountByLineNumber = () => {
        const grouped: Record<number, number> = {};
        store.chatItemStore.state.normalChatItems.forEach((item) => {
            if (item.lineNumber !== undefined) {
                grouped[item.lineNumber] = (grouped[item.lineNumber] ?? 0) + 1;
            }
        });

        return grouped;
    };

    return (
        <DebugOverlayLayout
            chatItemsCountByLineNumber={chatItemsCountByLineNumber()}
            processChatEventMetrics={roundMetrics(
                store.debugInfoStore.state.processChatEventMetrics,
            )}
            processXhrMetrics={roundMetrics(
                store.debugInfoStore.state.processXhrMetrics,
            )}
            processChatEventQueueLength={
                store.debugInfoStore.state.processChatEventQueueLength
            }
            outdatedRemovedChatEventCount={
                store.debugInfoStore.state.outdatedRemovedChatEventCount
            }
            cleanedChatItemCount={
                store.debugInfoStore.state.cleanedChatItemCount
            }
            liveChatDelay={roundMetrics(
                store.debugInfoStore.state.liveChatDelay,
            )}
            enqueuedChatItemCount={
                store.debugInfoStore.state.enqueuedChatItemCount
            }
            debugIntervalInSeconds={
                (store.debugInfoStore.state.lastEventTimeMs -
                    store.debugInfoStore.state.debugStartTimeMs) /
                1000
            }
        />
    );
};

export default DebugOverlay;
