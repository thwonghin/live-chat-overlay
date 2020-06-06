import { useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';

import { useVideoPlayerRect } from '@/hooks/use-video-player-rect';
import { ChatEventObserverContext } from '@/contexts/chat-observer';
import { chatEventsActions } from '@/reducers/chat-events';

export function useInitChatEventObserver(): void {
    const dispatch = useDispatch();
    const chatEventObserver = useContext(ChatEventObserverContext);
    const { width, height } = useVideoPlayerRect();

    useEffect(() => {
        chatEventObserver.addEventListener('add', (chatItem) => {
            dispatch(
                chatEventsActions.addItem({
                    chatItem,
                    playerRect: { width, height },
                }),
            );
        });

        chatEventObserver.start();

        return (): void => chatEventObserver.cleanup();
    }, [dispatch, chatEventObserver, width, height]);
}
