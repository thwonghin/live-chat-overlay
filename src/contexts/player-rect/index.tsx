import React, { useRef } from 'react';

import { getVideoPlayerEle } from '@/youtube-utils';
import { useRect } from '@/hooks';
import type { RectResult } from '@/hooks';

export function useVideoPlayerRect(): RectResult {
    const playerRef = useRef(getVideoPlayerEle());
    return useRect(playerRef);
}

export const PlayerRectContext = React.createContext<RectResult>({
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    height: 0,
    width: 0,
});

interface Props {
    children: React.ReactNode;
}

export const PlayerRectProvider: React.FC<Props> = ({ children }) => {
    const rect = useVideoPlayerRect();

    return (
        <PlayerRectContext.Provider value={rect}>
            {children}
        </PlayerRectContext.Provider>
    );
};
