import { type Component, For, Index, Show, createMemo } from 'solid-js';

import { useStore } from '@/contexts/root-store';
import type { Benchmark } from '@/stores/debug-info/types';

import styles from './index.module.scss';

type RoundedBenchmark = Readonly<{
    min: string;
    max: string;
    avg: string;
    count: number;
    latest: string;
}>;

function roundBenchmark(benchmark: Benchmark): RoundedBenchmark {
    return {
        min: benchmark.min.toFixed(2),
        max: benchmark.max.toFixed(2),
        avg: benchmark.avg.toFixed(2),
        count: benchmark.count,
        latest: benchmark.latest.toFixed(2),
    };
}

function renderBenchmark(benchmark: RoundedBenchmark): string[] {
    return [
        `min: ${benchmark.min}, max: ${benchmark.max}`,
        `avg: ${benchmark.avg}, count: ${benchmark.count}`,
        `latest: ${benchmark.latest}`,
    ];
}

type DebugOverlayLayoutProps = Readonly<{
    chatItemsCountByLineNumber: Record<number, number>;
    getEleWidthBenchmark: RoundedBenchmark;
    processXhrBenchmark: RoundedBenchmark;
    processChatEventBenchmark: RoundedBenchmark;
    processChatEventQueueLength: number;
    outdatedRemovedChatEventCount: number;
    cleanedChatItemCount: number;
    liveChatDelay: RoundedBenchmark;
}>;

export const DebugOverlayLayout: Component<DebugOverlayLayoutProps> = (
    props,
) => {
    const getElementWidthBenchMark = createMemo(() => {
        return renderBenchmark(props.getEleWidthBenchmark);
    });
    const processXhrBenchmark = createMemo(() => {
        return renderBenchmark(props.processXhrBenchmark);
    });
    const processChatEventBenchmark = createMemo(() => {
        return renderBenchmark(props.processChatEventBenchmark);
    });
    const liveChatDelayBenchmark = createMemo(() => {
        return renderBenchmark(props.liveChatDelay);
    });

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
            </div>
            <div class={styles['benchmark-container']}>
                <Show when={props.getEleWidthBenchmark.count !== 0}>
                    <p class={styles['debug-text']}>
                        Get element width benchmark (μs):
                    </p>
                    <Index each={getElementWidthBenchMark()}>
                        {(item) => <p class={styles['debug-text']}>{item()}</p>}
                    </Index>
                </Show>
                <br />
                <Show when={props.processXhrBenchmark.count !== 0}>
                    <p class={styles['debug-text']}>
                        Process response benchmark (μs):
                    </p>
                    <Index each={processXhrBenchmark()}>
                        {(item) => <p class={styles['debug-text']}>{item()}</p>}
                    </Index>
                </Show>
                <br />
                <p class={styles['debug-text']}>
                    {`Response Chat Event Queue Length: ${props.processChatEventQueueLength}`}
                </p>
                <Show when={props.processChatEventBenchmark.count !== 0}>
                    <p class={styles['debug-text']}>
                        Process chat event benchmark (μs):
                    </p>
                    <Index each={processChatEventBenchmark()}>
                        {(item) => <p class={styles['debug-text']}>{item()}</p>}
                    </Index>
                </Show>
                <br />
                <p class={styles['debug-text']}>
                    {`Removed Outdated Chat Event: ${props.outdatedRemovedChatEventCount}`}
                </p>
                <Show when={props.liveChatDelay.count !== 0}>
                    <p class={styles['debug-text']}>Live Chat Delay (s):</p>
                    <Index each={liveChatDelayBenchmark()}>
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

    const roundedGetEleWidthBenchmark = createMemo(() => {
        return roundBenchmark(
            store.debugInfoStore.debugInfo.getChatItemEleWidthBenchmark,
        );
    });
    const roundedProcessXhrBenchmark = createMemo(() => {
        return roundBenchmark(
            store.debugInfoStore.debugInfo.processXhrBenchmark,
        );
    });
    const roundedProcessChatEventBenchmark = createMemo(() => {
        return roundBenchmark(
            store.debugInfoStore.debugInfo.processChatEventBenchmark,
        );
    });
    const roundedLiveChatDelay = createMemo(() => {
        return roundBenchmark(store.debugInfoStore.debugInfo.liveChatDelay);
    });
    const chatItemsCountByLineNumber = createMemo(() => {
        const grouped: Record<number, number> = {};
        store.chatItemStore.value.normalChatItems.forEach((item) => {
            if (item.lineNumber !== undefined) {
                grouped[item.lineNumber] = (grouped[item.lineNumber] ?? 0) + 1;
            }
        });

        return grouped;
    });

    return (
        <DebugOverlayLayout
            chatItemsCountByLineNumber={chatItemsCountByLineNumber()}
            getEleWidthBenchmark={roundedGetEleWidthBenchmark()}
            processChatEventBenchmark={roundedProcessChatEventBenchmark()}
            processXhrBenchmark={roundedProcessXhrBenchmark()}
            processChatEventQueueLength={
                store.debugInfoStore.debugInfo.processChatEventQueueLength
            }
            outdatedRemovedChatEventCount={
                store.debugInfoStore.debugInfo.outdatedRemovedChatEventCount
            }
            cleanedChatItemCount={
                store.debugInfoStore.debugInfo.cleanedChatItemCount
            }
            liveChatDelay={roundedLiveChatDelay()}
        />
    );
};

export default DebugOverlay;
