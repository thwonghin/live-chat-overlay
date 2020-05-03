import React from 'react';

import { useChatEventObserver } from './hooks/use-chat-event-observer';

import { VideoPlayerRectContextProvider } from './contexts/video-player-rect';
import ChatFlow from './components/chat-flow';

export default function App(): JSX.Element {
    useChatEventObserver();

    return (
        <VideoPlayerRectContextProvider>
            <ChatFlow />
        </VideoPlayerRectContextProvider>
    );
}
