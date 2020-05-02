import React from 'react';
import { ChatEventContextProvider } from './contexts/chat-event';
import ChatFlow from './components/chat-flow';

export default function App() {
    return (
        <ChatEventContextProvider timeout={10000}>
            <ChatFlow />
        </ChatEventContextProvider>
    );
}
