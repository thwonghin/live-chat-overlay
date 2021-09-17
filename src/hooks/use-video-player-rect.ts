import { useContext } from 'react';

import * as contexts from '@/contexts';
import type { RectResult } from '@/hooks';

export function useVideoPlayerRect(): RectResult {
    const playerRect = useContext(contexts.playerRect.PlayerRectContext);

    return playerRect;
}
