import React from 'react';
import { ChatEventResponseObserver } from '@/services/chat-event/response-observer';
import type { InitData } from '@/definitions/youtube';

export const ChatEventObserverContext = React.createContext<
    ChatEventResponseObserver
>(new ChatEventResponseObserver());

interface Props {
    children: React.ReactNode;
    initData: InitData;
}

const ChatEventObserverProvider: React.FC<Props> = ({ initData, children }) => {
    const observer = new ChatEventResponseObserver(initData);

    return (
        <ChatEventObserverContext.Provider value={observer}>
            {children}
        </ChatEventObserverContext.Provider>
    );
};

export { ChatEventObserverProvider };
