import React from 'react';
import { ChatEventContextProvider } from './contexts/chat-event';
import { VideoPlayerRectContextProvider } from './contexts/video-player-rect';
import ChatFlow from './components/chat-flow';

export default function App(): JSX.Element {
    return (
        <ChatEventContextProvider>
            <VideoPlayerRectContextProvider>
                <ChatFlow />
            </VideoPlayerRectContextProvider>
        </ChatEventContextProvider>
    );
}
