import { useContext } from 'react';
import { RectResult } from '@/hooks/use-rect';
import * as contexts from '@/contexts';

export function useVideoPlayerRect(): RectResult {
    const playerRect = useContext(contexts.playerRect.PlayerRectContext);

    return playerRect;
}
