import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useVideoPlayerRect } from './use-video-player-rect';
import { chatEventsActions } from '../reducers/chat-events';

export function useResetChatEventsOnPlayerRectChange(): void {
    const rect = useVideoPlayerRect();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(chatEventsActions.reset());
    }, [dispatch, rect.width, rect.height]);
}
