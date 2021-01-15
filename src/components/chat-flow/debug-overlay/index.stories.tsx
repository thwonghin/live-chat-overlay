import * as React from 'react';
import { DebugOverlayLayout } from './index';

const settings = { title: 'DebugOverlay' };

export default settings;

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
                outdatedRemovedChatEventCount={100}
            />
        </div>
    );
};
