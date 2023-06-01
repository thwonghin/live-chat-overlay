import { useRef, createContext, type PropsWithChildren } from 'react';

import { useRect } from '@/hooks';
import type { RectResult } from '@/hooks';
import { youtube } from '@/utils';

export function useVideoPlayerRect(): RectResult {
    const playerRef = useRef(youtube.getVideoPlayerEle() ?? null);
    return useRect(playerRef);
}

export const PlayerRectContext = createContext<RectResult>({
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    height: 0,
    width: 0,
});

export const PlayerRectProvider: React.FC<PropsWithChildren> = ({
    children,
}) => {
    const rect = useVideoPlayerRect();

    return (
        <PlayerRectContext.Provider value={rect}>
            {children}
        </PlayerRectContext.Provider>
    );
};
