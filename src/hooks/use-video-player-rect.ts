import { useContext } from 'react';
import { RectResult } from '@/hooks/use-rect';
import { PlayerRectContext } from '@/contexts/player-rect';

export function useVideoPlayerRect(): RectResult {
    const playerRect = useContext(PlayerRectContext);

    return playerRect;
}
