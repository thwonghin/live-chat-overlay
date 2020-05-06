import { useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useVideoPlayerState } from './use-video-player-state';
import { chatEventsActions } from '../reducers/chat-events';

import { ChatEventObserverContext } from '../contexts/chat-observer';

export function useHandleChatEventOnPlayerStateChange(): void {
    const chatEventObserver = useContext(ChatEventObserverContext);
    const { isPaused, isSeeking } = useVideoPlayerState();
    const dispatch = useDispatch();

    useEffect(() => {
        if (isPaused) {
            chatEventObserver.pause();
        } else {
            chatEventObserver.resume();
        }
    }, [isPaused, chatEventObserver]);

    useEffect(() => {
        if (isSeeking) {
            chatEventObserver.pause();
            chatEventObserver.reset();
            dispatch(chatEventsActions.reset());
        } else if (!isPaused) {
            chatEventObserver.resume();
        }
    }, [isSeeking, isPaused, chatEventObserver, dispatch]);
}
