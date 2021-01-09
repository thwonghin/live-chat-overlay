import {useContext} from 'react';
import type {RectResult} from '@/hooks';
import * as contexts from '@/contexts';

export function useVideoPlayerRect(): RectResult {
    const playerRect = useContext(contexts.playerRect.PlayerRectContext);

    return playerRect;
}
