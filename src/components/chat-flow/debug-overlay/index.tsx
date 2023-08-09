import * as React from 'react';

import { observer } from 'mobx-react-lite';
import { styled } from 'styled-components';

import { useStore } from '@/contexts/root-store';
import type { ChatItemModel } from '@/models/chat-item';
import type { Benchmark } from '@/models/debug-info/types';

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

const DebugContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`;

const DebugText = styled.p`
    font-size: 20px;
    color: #ff0;
    white-space: nowrap;
    -webkit-text-stroke-color: #000;
    -webkit-text-stroke-width: 1px;
`;

const BenchmarkContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    text-align: right;
`;

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
            <DebugContainer>
                <DebugText>Message Count By Position:</DebugText>
                {Array.from(chatItemsByLineNumber.entries()).map(
                    ([lineNumber, chatItems]) => (
                        <DebugText key={lineNumber}>{`${lineNumber + 1}: ${
                            (chatItems ?? []).length
                        }`}</DebugText>
                    ),
                )}
            </DebugContainer>
            <BenchmarkContainer>
                {getEleWidthBenchmark.count !== 0 && (
                    <>
                        <DebugText>Get element width benchmark (μs):</DebugText>
                        {renderBenchmark(getEleWidthBenchmark).map(
                            ({ key, text }) => (
                                <DebugText key={key}>{text}</DebugText>
                            ),
                        )}
                    </>
                )}
                <br />
                {processXhrBenchmark.count !== 0 && (
                    <>
                        <DebugText>Process response benchmark (μs):</DebugText>
                        {renderBenchmark(processXhrBenchmark).map(
                            ({ key, text }) => (
                                <DebugText key={key}>{text}</DebugText>
                            ),
                        )}
                    </>
                )}
                <br />
                <DebugText>
                    {`Response Chat Event Queue Length: ${processChatEventQueueLength}`}
                </DebugText>
                {processChatEventBenchmark.count !== 0 && (
                    <>
                        <DebugText>
                            Process chat event benchmark (μs):
                        </DebugText>
                        {renderBenchmark(processChatEventBenchmark).map(
                            ({ key, text }) => (
                                <DebugText key={key}>{text}</DebugText>
                            ),
                        )}
                    </>
                )}
                <br />
                <DebugText>
                    {`Removed Outdated Chat Event: ${outdatedRemovedChatEventCount}`}
                </DebugText>
                {liveChatDelay.count !== 0 && (
                    <>
                        <DebugText>Live Chat Delay (s):</DebugText>
                        {renderBenchmark(liveChatDelay).map(({ key, text }) => (
                            <DebugText key={key}>{text}</DebugText>
                        ))}
                    </>
                )}
                <DebugText>
                    {`Cleaned Chat Item: ${cleanedChatItemCount}`}
                </DebugText>
            </BenchmarkContainer>
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
