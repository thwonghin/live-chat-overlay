import React, { useMemo } from 'react';

import { VideoPlayerRectContext } from './context';
import { getVideoPlayerEle } from '../../../utils';
import { useRect } from '../../hooks/use-rect';

interface VideoPlayerRectContextProviderProps {
    children: JSX.Element;
}

const playerRef = { current: getVideoPlayerEle() };

export default function VideoPlayerRectContextProvider({
    children,
}: VideoPlayerRectContextProviderProps): JSX.Element {
    const rect = useRect(playerRef);

    const value = useMemo(
        () => ({
            rect,
        }),
        [rect],
    );

    return (
        <VideoPlayerRectContext.Provider value={value}>
            {children}
        </VideoPlayerRectContext.Provider>
    );
}
