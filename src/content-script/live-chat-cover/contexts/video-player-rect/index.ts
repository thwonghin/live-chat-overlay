import { useContext } from 'react';

import { VideoPlayerRectContext, VideoPlayerRectContextValue } from './context';
import VideoPlayerRectContextProvider from './video-player-rect-context-provider';

export { VideoPlayerRectContextProvider };

export function useVideoPlayerRectContext(): VideoPlayerRectContextValue {
    return useContext(VideoPlayerRectContext);
}
