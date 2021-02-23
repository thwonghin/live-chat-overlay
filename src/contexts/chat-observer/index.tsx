import * as React from 'react';

import { chatEvent } from '@/services';
import { youtube } from '@/utils';

export const ChatEventObserverContext = React.createContext<chatEvent.ResponseObserver>(
    new chatEvent.ResponseObserver(
        '_chat_message',
        document.createElement('video'),
    ),
);

interface Props {
    chatEventPrefix: string;
    children: React.ReactNode;
}

export const ChatEventObserverProvider: React.FC<Props> = ({
    chatEventPrefix,
    children,
}) => {
    const video = React.useMemo(() => youtube.getVideoEle(), []);
    if (!video) {
        throw new Error('Video element not found');
    }

    const observer = React.useMemo(
        () =>
            new chatEvent.ResponseObserver(
                `${chatEventPrefix}_chat_message`,
                video,
            ),
        [chatEventPrefix, video],
    );

    return (
        <ChatEventObserverContext.Provider value={observer}>
            {children}
        </ChatEventObserverContext.Provider>
    );
};
