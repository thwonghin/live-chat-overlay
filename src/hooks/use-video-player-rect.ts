import { useMemo } from 'react';

import { getVideoPlayerEle } from '@/youtube-dom-utils';
import { useRect, RectResult } from './use-rect';

export function useVideoPlayerRect(): RectResult {
    const playerRef = useMemo(() => ({ current: getVideoPlayerEle() }), []);
    return useRect(playerRef);
}
