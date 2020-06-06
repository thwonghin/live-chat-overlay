import { useContext, useEffect } from 'react';

import { ChatEventObserverContext } from '@/contexts/chat-observer';
import { useVideoPlayerState } from './use-video-player-state';

export function useHandleChatEventOnPlayerStateChange(): void {
    const chatEventObserver = useContext(ChatEventObserverContext);
    const { isPaused, isSeeking } = useVideoPlayerState();

    useEffect(() => {
        if (isPaused) {
            chatEventObserver.pause();
        } else {
            chatEventObserver.resume();
        }
    }, [isPaused, chatEventObserver]);

    useEffect(() => {
        if (isSeeking) {
            chatEventObserver.reset();
        }
    }, [isSeeking, chatEventObserver]);
}
