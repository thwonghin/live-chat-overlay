import { useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';

import { ChatEventObserverContext } from '@/contexts/chat-observer';
import { chatEventsActions } from '@/reducers/chat-events';

import { useVideoPlayerRect } from './use-video-player-rect';

export function useResetChatEventsOnPlayerRectChange(): void {
    const rect = useVideoPlayerRect();
    const dispatch = useDispatch();
    const chatEventObserver = useContext(ChatEventObserverContext);

    useEffect(() => {
        dispatch(chatEventsActions.reset());
        chatEventObserver.reset();
    }, [dispatch, rect.width, rect.height, chatEventObserver]);
}
