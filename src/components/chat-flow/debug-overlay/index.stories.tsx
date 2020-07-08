import React from 'react';
import { DebugOverlayLayout } from './index';

export default { title: 'DebugOverlay' };

export const DebugOverlay: React.FC = () => {
    return (
        <div style={{ width: 800, height: 800, position: 'relative' }}>
            <DebugOverlayLayout
                chatEventDebugInfo={{
                    messageByLineNumber: [
                        {
                            row: 1,
                            count: 1,
                        },
                    ],
                    doneItemsCount: 100,
                    messagesCount: 100,
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
                processXhrQueueLength={100}
                outdatedRemovedChatEventCount={100}
            />
        </div>
    );
};
