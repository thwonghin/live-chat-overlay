import * as React from 'react';
import { browser } from 'webextension-polyfill-ts';

import { chatEvent } from '@/services';
import { youtube } from '@/utils';

const CHAT_EVENT_NAME = `${browser.runtime.id}_chat_message`;

export const ChatEventObserverContext = React.createContext<chatEvent.ResponseObserver>(
    new chatEvent.ResponseObserver(
        CHAT_EVENT_NAME,
        document.createElement('video'),
    ),
);

interface Props {
    children: React.ReactNode;
}

export const ChatEventObserverProvider: React.FC<Props> = ({ children }) => {
    const video = youtube.getVideoEle();
    if (!video) {
        throw new Error('Video element not found');
    }
    const observer = new chatEvent.ResponseObserver(CHAT_EVENT_NAME, video);

    return (
        <ChatEventObserverContext.Provider value={observer}>
            {children}
        </ChatEventObserverContext.Provider>
    );
};
