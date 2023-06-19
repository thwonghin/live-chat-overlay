import * as React from 'react';

import { ChatItemModel } from '@/models/chat-item';

import { DebugOverlayLayout } from '.';

const settings = { title: 'DebugOverlay' };

export default settings;

export const DebugOverlay: React.FC = () => {
    return (
        <div style={{ width: 800, height: 800, position: 'relative' }}>
            <DebugOverlayLayout
                chatItemsByLineNumber={
                    new Map([
                        [
                            1,
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                            [new ChatItemModel({} as any, {} as any, 1, false)],
                        ],
                    ])
                }
                getEleWidthBenchmark={{
                    min: '100.00',
                    max: '200.00',
                    avg: '150.00',
                    count: 10,
                    latest: '10',
                }}
                processChatEventBenchmark={{
                    min: '100.00',
                    max: '200.00',
                    avg: '150.00',
                    count: 10,
                    latest: '10',
                }}
                processXhrBenchmark={{
                    min: '100.00',
                    max: '200.00',
                    avg: '150.00',
                    count: 10,
                    latest: '10',
                }}
                liveChatDelay={{
                    min: '100.00',
                    max: '200.00',
                    avg: '150.00',
                    count: 10,
                    latest: '10',
                }}
                processChatEventQueueLength={100}
                outdatedRemovedChatEventCount={200}
                cleanedChatItemCount={300}
            />
        </div>
    );
};
