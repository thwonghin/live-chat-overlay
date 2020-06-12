import React from 'react';
import { ChatEventResponseObserver } from '@/services/chat-event/response-observer';
import { getVideoEle } from '@/youtube-utils';

export const ChatEventObserverContext = React.createContext<
    ChatEventResponseObserver
>(new ChatEventResponseObserver(() => 0));

interface Props {
    children: React.ReactNode;
}

const ChatEventObserverProvider: React.FC<Props> = ({ children }) => {
    const observer = new ChatEventResponseObserver(
        () => getVideoEle()?.currentTime ?? 0,
    );

    return (
        <ChatEventObserverContext.Provider value={observer}>
            {children}
        </ChatEventObserverContext.Provider>
    );
};

export { ChatEventObserverProvider };
