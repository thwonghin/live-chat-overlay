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
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    new Map([[1, [new ChatItemModel({} as any, 1)]]])
                }
                getEleWidthBenchmark={{
                    min: '100.00',
                    max: '200.00',
                    avg: '150.00',
                    count: 10,
                }}
                processChatEventBenchmark={{
                    min: '100.00',
                    max: '200.00',
                    avg: '150.00',
                    count: 10,
                }}
                processXhrBenchmark={{
                    min: '100.00',
                    max: '200.00',
                    avg: '150.00',
                    count: 10,
                }}
                processChatEventQueueLength={100}
                outdatedRemovedChatEventCount={200}
                cleanedChatItemCount={300}
            />
        </div>
    );
};
