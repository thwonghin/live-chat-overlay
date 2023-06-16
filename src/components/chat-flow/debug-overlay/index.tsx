import * as React from 'react';

import { observer } from 'mobx-react-lite';
import { useSelector, shallowEqual } from 'react-redux';
import styled from 'styled-components';

import type { RootState } from '@/app/live-chat-overlay/store';
import { useDebugInfoStore } from '@/contexts/debug-info';
import type { Benchmark } from '@/models/debug-info/types';

type ChatEventDebugInfo = {
    messagesCount: number;
    messageByLineNumber: Array<{
        row: number;
        count: number;
    }>;
    doneItemsCount: number;
};

type RoundedBenchmark = {
    min: string;
    max: string;
    avg: string;
    count: number;
};

function roundBenchmark(benchmark: Benchmark): RoundedBenchmark {
    return {
        min: benchmark.min.toFixed(2),
        max: benchmark.max.toFixed(2),
        avg: benchmark.avg.toFixed(2),
        count: benchmark.count,
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
    chatEventDebugInfo: ChatEventDebugInfo;
    getEleWidthBenchmark: RoundedBenchmark;
    processXhrBenchmark: RoundedBenchmark;
    processChatEventBenchmark: RoundedBenchmark;
    processChatEventQueueLength: number;
    outdatedRemovedChatEventCount: number;
};

export const DebugOverlayLayout: React.FC<DebugOverlayLayoutProps> = ({
    chatEventDebugInfo,
    getEleWidthBenchmark,
    processChatEventBenchmark,
    processXhrBenchmark,
    processChatEventQueueLength,
    outdatedRemovedChatEventCount,
}) => {
    return (
        <>
            <DebugContainer>
                <DebugText>
                    {`Messages Count: ${chatEventDebugInfo.messagesCount}`}
                </DebugText>
                <DebugText>
                    {`Done Items Count: ${chatEventDebugInfo.doneItemsCount}`}
                </DebugText>
                {chatEventDebugInfo.messageByLineNumber.length > 0 && (
                    <DebugText>Message Count By Position:</DebugText>
                )}
                {chatEventDebugInfo.messageByLineNumber.map(
                    ({ row, count }) => (
                        <DebugText key={row}>
                            {`${row + 1}: ${count}`}
                        </DebugText>
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
            </BenchmarkContainer>
        </>
    );
};

const DebugOverlay = observer(() => {
    const chatEventDebugInfo = useSelector<RootState, ChatEventDebugInfo>(
        (state) => ({
            messagesCount: state.chatEvents.chatItems.length,
            messageByLineNumber: Object.entries(
                state.chatEvents.chatItemsByLineNumber,
            ).map(([key, value]) => {
                return {
                    row: Number(key),
                    count: (value ?? []).length,
                };
            }),
            doneItemsCount: Object.values(
                state.chatEvents.chatItemStateById,
            ).filter((chatItemState) => chatItemState === 'finished').length,
        }),
        shallowEqual,
    );

    const {
        debugInfoModel: {
            getChatItemEleWidthBenchmark,
            processXhrBenchmark,
            processChatEventBenchmark,
            processChatEventQueueLength,
            outdatedRemovedChatEventCount,
        },
    } = useDebugInfoStore();

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

    return (
        <DebugOverlayLayout
            chatEventDebugInfo={chatEventDebugInfo}
            getEleWidthBenchmark={roundedGetEleWidthBenchmark}
            processChatEventBenchmark={roundedProcessXhrBenchmark}
            processXhrBenchmark={roundedProcessChatEventBenchmark}
            processChatEventQueueLength={processChatEventQueueLength}
            outdatedRemovedChatEventCount={outdatedRemovedChatEventCount}
        />
    );
});

export default DebugOverlay;
