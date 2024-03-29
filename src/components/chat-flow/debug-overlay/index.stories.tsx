import { type Component } from 'solid-js';

import { DebugOverlayLayout } from '.';

const settings = { title: 'DebugOverlay' };

export default settings;

export const DebugOverlay: Component = () => {
    return (
        <div style={{ width: '800px', height: '800px', position: 'relative' }}>
            <DebugOverlayLayout
                chatItemsCountByLineNumber={{
                    1: 1,
                }}
                enqueuedChatItemCount={1}
                processChatEventMetrics={{
                    min: '100.00',
                    max: '200.00',
                    avg: '150.00',
                    count: 10,
                    latest: '10',
                }}
                processXhrMetrics={{
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
                debugIntervalInSeconds={1000}
            />
        </div>
    );
};
