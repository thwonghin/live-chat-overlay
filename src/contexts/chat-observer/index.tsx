import * as React from 'react';

import { LIVE_CHAT_API_INTERCEPT_EVENT } from '@/constants';
import { chatEvent } from '@/services';
import { youtube } from '@/utils';

export const ChatEventObserverContext =
    React.createContext<chatEvent.ResponseObserver>(
        new chatEvent.ResponseObserver(
            LIVE_CHAT_API_INTERCEPT_EVENT,
            document.createElement('video'),
        ),
    );

export const ChatEventObserverProvider: React.FC<React.PropsWithChildren> = ({
    children,
}) => {
    const video = React.useMemo(() => youtube.getVideoEle(), []);
    if (!video) {
        throw new Error('Video element not found');
    }

    const observer = React.useMemo(
        () =>
            new chatEvent.ResponseObserver(
                LIVE_CHAT_API_INTERCEPT_EVENT,
                video,
            ),
        [video],
    );

    return (
        <ChatEventObserverContext.Provider value={observer}>
            {children}
        </ChatEventObserverContext.Provider>
    );
};
