import * as React from 'react';
import { browser } from 'webextension-polyfill-ts';

import { chatEvent, settingsStorage } from '@/services';
import { getVideoEle } from '@/utils/youtube';
import { useSettings } from '@/hooks';

const CHAT_EVENT_NAME = `${browser.runtime.id}_chat_message`;

export const ChatEventObserverContext = React.createContext<chatEvent.ResponseObserver>(
    new chatEvent.ResponseObserver(
        CHAT_EVENT_NAME,
        document.createElement('video'),
        {} as settingsStorage.Settings,
    ),
);

interface Props {
    children: React.ReactNode;
}

export const ChatEventObserverProvider: React.FC<Props> = ({ children }) => {
    const video = getVideoEle();
    if (!video) {
        throw new Error('Video element not found');
    }
    const { settings } = useSettings();
    const observer = new chatEvent.ResponseObserver(
        CHAT_EVENT_NAME,
        video,
        settings,
    );

    return (
        <ChatEventObserverContext.Provider value={observer}>
            {children}
        </ChatEventObserverContext.Provider>
    );
};
