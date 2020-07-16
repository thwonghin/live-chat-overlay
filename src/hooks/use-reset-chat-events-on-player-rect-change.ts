import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { chatEventsActions } from '@/reducers/chat-events';

import { useVideoPlayerRect } from './use-video-player-rect';

export function useResetChatEventsOnPlayerRectChange(): void {
    const rect = useVideoPlayerRect();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(chatEventsActions.reset());
    }, [dispatch, rect.width, rect.height]);
}
