import * as React from 'react';

import { LIVE_CHAT_API_INTERCEPT_EVENT } from '@/constants';
import { chatEvent } from '@/services';
import { youtube } from '@/utils';

import { useDebugInfoStore } from '../debug-info';

export const ChatEventObserverContext =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    React.createContext<chatEvent.ResponseObserver>({} as any);

export const ChatEventObserverProvider: React.FC<React.PropsWithChildren> = ({
    children,
}) => {
    const video = React.useMemo(() => youtube.getVideoEle(), []);
    if (!video) {
        throw new Error('Video element not found');
    }

    const debugInfoStore = useDebugInfoStore();

    const observer = React.useMemo(
        () =>
            new chatEvent.ResponseObserver(
                LIVE_CHAT_API_INTERCEPT_EVENT,
                video,
                debugInfoStore,
            ),
        [video, debugInfoStore],
    );

    return (
        <ChatEventObserverContext.Provider value={observer}>
            {children}
        </ChatEventObserverContext.Provider>
    );
};
