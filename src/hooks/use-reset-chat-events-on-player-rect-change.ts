import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { chatEvents } from '@/features';

import { useVideoPlayerRect } from './use-video-player-rect';

export function useResetChatEventsOnPlayerRectChange(): void {
    const rect = useVideoPlayerRect();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(chatEvents.actions.reset());
    }, [dispatch, rect.width, rect.height]);
}
