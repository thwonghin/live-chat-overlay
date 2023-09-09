import { useStore } from '@/contexts/root-store';
import type { ChatItemModel } from '@/models/chat-item';
import type { Benchmark } from '@/stores/debug-info/types';

import styles from './index.module.scss';
import { For, Show, createMemo } from 'solid-js';

type RoundedBenchmark = {
    min: string;
    max: string;
    avg: string;
    count: number;
    latest: string;
};

function roundBenchmark(benchmark: Benchmark): RoundedBenchmark {
    return {
        min: benchmark.min.toFixed(2),
        max: benchmark.max.toFixed(2),
        avg: benchmark.avg.toFixed(2),
        count: benchmark.count,
        latest: benchmark.latest.toFixed(2),
    };
}

function renderBenchmark(
    benchmark: RoundedBenchmark,
): Array<{ key: string; text: string }> {
    return [
        {
            key: 'min-max',
            text: `min: ${benchmark.min}, max: ${benchmark.max}`,
        },
        {
            key: 'avg',
            text: `avg: ${benchmark.avg}, count: ${benchmark.count}`,
        },
        {
            key: 'latest',
            text: `latest: ${benchmark.latest}`,
        },
    ];
}

type DebugOverlayLayoutProps = Readonly<{
    chatItemsByLineNumber: Record<number, ChatItemModel[]>;
    getEleWidthBenchmark: RoundedBenchmark;
    processXhrBenchmark: RoundedBenchmark;
    processChatEventBenchmark: RoundedBenchmark;
    processChatEventQueueLength: number;
    outdatedRemovedChatEventCount: number;
    cleanedChatItemCount: number;
    liveChatDelay: RoundedBenchmark;
}>;

export const DebugOverlayLayout = (props: DebugOverlayLayoutProps) => {
    const chatItems = createMemo(() => {
        return Object.entries(props.chatItemsByLineNumber);
    });
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
                <For each={chatItems()}>
                    {([lineNumber, chatItems]) => (
                        <p class={styles['debug-text']}>{`${lineNumber + 1}: ${
                            (chatItems ?? []).length
                        }`}</p>
                    )}
                </For>
            </div>
            <div class={styles['benchmark-container']}>
                <Show when={props.getEleWidthBenchmark.count !== 0}>
                    <p class={styles['debug-text']}>
                        Get element width benchmark (μs):
                    </p>
                    <For each={getElementWidthBenchMark()}>
                        {(item) => (
                            <p class={styles['debug-text']}>{item.text}</p>
                        )}
                    </For>
                </Show>
                <br />
                <Show when={props.processXhrBenchmark.count !== 0}>
                    <p class={styles['debug-text']}>
                        Process response benchmark (μs):
                    </p>
                    <For each={processXhrBenchmark()}>
                        {(item) => (
                            <p class={styles['debug-text']}>{item.text}</p>
                        )}
                    </For>
                </Show>
                <br />
                <p class={styles['debug-text']}>
                    {`Response Chat Event Queue Length: ${props.processChatEventQueueLength}`}
                </p>
                <Show when={props.processChatEventBenchmark.count !== 0}>
                    <p class={styles['debug-text']}>
                        Process chat event benchmark (μs):
                    </p>
                    <For each={processChatEventBenchmark()}>
                        {(item) => (
                            <p class={styles['debug-text']}>{item.text}</p>
                        )}
                    </For>
                </Show>
                <br />
                <p class={styles['debug-text']}>
                    {`Removed Outdated Chat Event: ${props.outdatedRemovedChatEventCount}`}
                </p>
                <Show when={props.liveChatDelay.count !== 0}>
                    <p class={styles['debug-text']}>Live Chat Delay (s):</p>
                    <For each={liveChatDelayBenchmark()}>
                        {(item) => (
                            <p class={styles['debug-text']}>{item.text}</p>
                        )}
                    </For>
                </Show>
                <p class={styles['debug-text']}>
                    {`Cleaned Chat Item: ${props.cleanedChatItemCount}`}
                </p>
            </div>
        </>
    );
};

const DebugOverlay = () => {
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

    return (
        <DebugOverlayLayout
            chatItemsByLineNumber={store.chatItemStore.chatItemsByLineNumber}
            getEleWidthBenchmark={roundedGetEleWidthBenchmark()}
            processChatEventBenchmark={roundedProcessXhrBenchmark()}
            processXhrBenchmark={roundedProcessChatEventBenchmark()}
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
