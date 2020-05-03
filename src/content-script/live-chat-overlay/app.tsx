import React from 'react';

import { useChatEventObserver } from './hooks/use-chat-event-observer';
import { useResetChatEventsOnPlayerRectChange } from './hooks/use-reset-chat-events-on-player-rect-change';

import ChatFlow from './components/chat-flow';

export default function App(): JSX.Element {
    useChatEventObserver();
    useResetChatEventsOnPlayerRectChange();

    return <ChatFlow />;
}
