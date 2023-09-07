import * as React from 'react';

import { observer } from 'mobx-react-lite';

import { useStore } from '@/contexts/root-store';
import type { ChatItemModel } from '@/models/chat-item';
import type { Benchmark } from '@/models/debug-info/types';

import styles from './index.module.scss';

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

type DebugOverlayLayoutProps = {
    readonly chatItemsByLineNumber: Map<number, ChatItemModel[]>;
    readonly getEleWidthBenchmark: RoundedBenchmark;
    readonly processXhrBenchmark: RoundedBenchmark;
    readonly processChatEventBenchmark: RoundedBenchmark;
    readonly processChatEventQueueLength: number;
    readonly outdatedRemovedChatEventCount: number;
    readonly cleanedChatItemCount: number;
    readonly liveChatDelay: RoundedBenchmark;
};

export const DebugOverlayLayout: React.FC<DebugOverlayLayoutProps> = ({
    chatItemsByLineNumber,
    getEleWidthBenchmark,
    processChatEventBenchmark,
    processXhrBenchmark,
    processChatEventQueueLength,
    outdatedRemovedChatEventCount,
    cleanedChatItemCount,
    liveChatDelay,
}) => {
    return (
        <>
            <div className={styles['debug-container']}>
                <p className={styles['debug-text']}>
                    Message Count By Position:
                </p>
                {Array.from(chatItemsByLineNumber.entries()).map(
                    ([lineNumber, chatItems]) => (
                        <p
                            key={lineNumber}
                            className={styles['debug-text']}
                        >{`${lineNumber + 1}: ${(chatItems ?? []).length}`}</p>
                    ),
                )}
            </div>
            <div className={styles['benchmark-container']}>
                {getEleWidthBenchmark.count !== 0 && (
                    <>
                        <p className={styles['debug-text']}>
                            Get element width benchmark (μs):
                        </p>
                        {renderBenchmark(getEleWidthBenchmark).map(
                            ({ key, text }) => (
                                <p key={key} className={styles['debug-text']}>
                                    {text}
                                </p>
                            ),
                        )}
                    </>
                )}
                <br />
                {processXhrBenchmark.count !== 0 && (
                    <>
                        <p className={styles['debug-text']}>
                            Process response benchmark (μs):
                        </p>
                        {renderBenchmark(processXhrBenchmark).map(
                            ({ key, text }) => (
                                <p key={key} className={styles['debug-text']}>
                                    {text}
                                </p>
                            ),
                        )}
                    </>
                )}
                <br />
                <p className={styles['debug-text']}>
                    {`Response Chat Event Queue Length: ${processChatEventQueueLength}`}
                </p>
                {processChatEventBenchmark.count !== 0 && (
                    <>
                        <p className={styles['debug-text']}>
                            Process chat event benchmark (μs):
                        </p>
                        {renderBenchmark(processChatEventBenchmark).map(
                            ({ key, text }) => (
                                <p key={key} className={styles['debug-text']}>
                                    {text}
                                </p>
                            ),
                        )}
                    </>
                )}
                <br />
                <p className={styles['debug-text']}>
                    {`Removed Outdated Chat Event: ${outdatedRemovedChatEventCount}`}
                </p>
                {liveChatDelay.count !== 0 && (
                    <>
                        <p className={styles['debug-text']}>
                            Live Chat Delay (s):
                        </p>
                        {renderBenchmark(liveChatDelay).map(({ key, text }) => (
                            <p key={key} className={styles['debug-text']}>
                                {text}
                            </p>
                        ))}
                    </>
                )}
                <p className={styles['debug-text']}>
                    {`Cleaned Chat Item: ${cleanedChatItemCount}`}
                </p>
            </div>
        </>
    );
};

const DebugOverlay = observer(() => {
    const {
        debugInfoStore: {
            debugInfoModel: {
                getChatItemEleWidthBenchmark,
                processXhrBenchmark,
                processChatEventBenchmark,
                processChatEventQueueLength,
                outdatedRemovedChatEventCount,
                cleanedChatItemCount,
                liveChatDelay,
            },
        },
        chatItemStore: { chatItemsByLineNumber },
    } = useStore();

    const roundedGetEleWidthBenchmark = React.useMemo(
        () => roundBenchmark(getChatItemEleWidthBenchmark),
        [getChatItemEleWidthBenchmark],
    );
    const roundedProcessXhrBenchmark = React.useMemo(
        () => roundBenchmark(processXhrBenchmark),
        [processXhrBenchmark],
    );
    const roundedProcessChatEventBenchmark = React.useMemo(
        () => roundBenchmark(processChatEventBenchmark),
        [processChatEventBenchmark],
    );
    const roundedLiveChatDelay = React.useMemo(
        () => roundBenchmark(liveChatDelay),
        [liveChatDelay],
    );

    return (
        <DebugOverlayLayout
            chatItemsByLineNumber={chatItemsByLineNumber}
            getEleWidthBenchmark={roundedGetEleWidthBenchmark}
            processChatEventBenchmark={roundedProcessXhrBenchmark}
            processXhrBenchmark={roundedProcessChatEventBenchmark}
            processChatEventQueueLength={processChatEventQueueLength}
            outdatedRemovedChatEventCount={outdatedRemovedChatEventCount}
            cleanedChatItemCount={cleanedChatItemCount}
            liveChatDelay={roundedLiveChatDelay}
        />
    );
});

export default DebugOverlay;
