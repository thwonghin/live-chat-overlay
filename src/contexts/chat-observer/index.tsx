import React from 'react';
import { ChatEventResponseObserver } from '@/services/chat-event/response-observer';

export const ChatEventObserverContext = React.createContext<
    ChatEventResponseObserver
>(new ChatEventResponseObserver());

interface Props {
    children: React.ReactNode;
}

export const ChatEventObserverProvider: React.FC<Props> = ({ children }) => {
    const observer = new ChatEventResponseObserver();

    return (
        <ChatEventObserverContext.Provider value={observer}>
            {children}
        </ChatEventObserverContext.Provider>
    );
};
