import React from 'react';
import { getLiveChatEle } from '@/youtube-dom-utils';
import { ChatEventDomObserver } from '@/services/chat-event';

export const ChatEventObserverContext = React.createContext<ChatEventDomObserver>(
    new ChatEventDomObserver({
        containerEle: getLiveChatEle()!,
    }),
);

interface Props {
    children: React.ReactNode;
}

const ChatEventObserverProvider: React.FC<Props> = ({ children }) => {
    const liveChatEle = getLiveChatEle();
    if (!liveChatEle) {
        throw new Error('Live chat ele not found');
    }

    const observer = new ChatEventDomObserver({
        containerEle: liveChatEle,
    });

    return (
        <ChatEventObserverContext.Provider value={observer}>
            {children}
        </ChatEventObserverContext.Provider>
    );
};

export { ChatEventObserverProvider };
