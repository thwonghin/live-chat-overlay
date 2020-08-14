import React from 'react';
import { browser } from 'webextension-polyfill-ts';

import { chatEvent } from '@/services';

const CHAT_EVENT_NAME = `${browser.runtime.id}_chat_message`;

export const ChatEventObserverContext = React.createContext<
    chatEvent.ResponseObserver
>(new chatEvent.ResponseObserver(CHAT_EVENT_NAME));

interface Props {
    children: React.ReactNode;
}

export const ChatEventObserverProvider: React.FC<Props> = ({ children }) => {
    const observer = new chatEvent.ResponseObserver(CHAT_EVENT_NAME);

    return (
        <ChatEventObserverContext.Provider value={observer}>
            {children}
        </ChatEventObserverContext.Provider>
    );
};
