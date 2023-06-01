import { useMemo, useState, useEffect, useCallback } from 'react';

import { youtube } from '@/utils';

type PlayerState = {
    isSeeking: boolean;
    isPaused: boolean;
};

export function useVideoPlayerState(): PlayerState {
    const videoEle = useMemo(() => youtube.getVideoEle(), []);

    const [isSeeking, setIsSeeking] = useState(videoEle?.seeking ?? false);
    const [isPaused, setIsPaused] = useState(videoEle?.paused ?? false);

    const handleStateChange = useCallback(() => {
        setIsSeeking(videoEle?.seeking ?? false);
        setIsPaused(videoEle?.paused ?? false);
    }, [videoEle]);

    useEffect(() => {
        videoEle?.addEventListener('seeking', handleStateChange);
        videoEle?.addEventListener('pause', handleStateChange);
        videoEle?.addEventListener('play', handleStateChange);
        videoEle?.addEventListener('playing', handleStateChange);
        videoEle?.addEventListener('seeked', handleStateChange);

        return (): void => {
            videoEle?.removeEventListener('seeking', handleStateChange);
            videoEle?.removeEventListener('pause', handleStateChange);
            videoEle?.removeEventListener('play', handleStateChange);
            videoEle?.removeEventListener('playing', handleStateChange);
            videoEle?.removeEventListener('seeked', handleStateChange);
        };
    }, [videoEle, handleStateChange]);
    return {
        isSeeking,
        isPaused,
    };
}
