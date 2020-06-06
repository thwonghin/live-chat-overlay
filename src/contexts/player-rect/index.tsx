import React, { useMemo } from 'react';

import { getVideoPlayerEle } from '@/youtube-dom-utils';
import { useRect, RectResult } from '@/hooks/use-rect';

export function useVideoPlayerRect(): RectResult {
    const playerRef = useMemo(() => ({ current: getVideoPlayerEle() }), []);
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

const PlayerRectProvider: React.FC<Props> = ({ children }) => {
    const rect = useVideoPlayerRect();

    return (
        <PlayerRectContext.Provider value={rect}>
            {children}
        </PlayerRectContext.Provider>
    );
};

export { PlayerRectProvider };
