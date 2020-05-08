import React from 'react';
import { getLiveChatEle } from '../../../utils';

import { ChatEventObserver } from '../../../services/chat-event';

export const ChatEventObserverContext = React.createContext<ChatEventObserver>(
    new ChatEventObserver({
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

    const observer = new ChatEventObserver({
        containerEle: liveChatEle,
    });

    return (
        <ChatEventObserverContext.Provider value={observer}>
            {children}
        </ChatEventObserverContext.Provider>
    );
};

export { ChatEventObserverProvider };
