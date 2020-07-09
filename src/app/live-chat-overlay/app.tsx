import React from 'react';

import { useInitChatEventObserver } from '@/hooks/use-init-chat-event-observer';
import { useResetChatEventsOnPlayerRectChange } from '@/hooks/use-reset-chat-events-on-player-rect-change';

import ChatFlow from '@/components/chat-flow';

const App: React.FC = () => {
    useInitChatEventObserver();
    useResetChatEventsOnPlayerRectChange();

    return <ChatFlow />;
};

export default App;
