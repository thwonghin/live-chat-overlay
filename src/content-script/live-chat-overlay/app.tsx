import React from 'react';

import { useInitChatEventObserver } from './hooks/use-init-chat-event-observer';
import { useResetChatEventsOnPlayerRectChange } from './hooks/use-reset-chat-events-on-player-rect-change';
import { useHandleChatEventOnPlayerStateChange } from './hooks/use-handle-chat-event-on-player-state-change';

import ChatFlow from './components/chat-flow';

export default function App(): JSX.Element {
    useInitChatEventObserver();
    useResetChatEventsOnPlayerRectChange();
    useHandleChatEventOnPlayerStateChange();

    return <ChatFlow />;
}
