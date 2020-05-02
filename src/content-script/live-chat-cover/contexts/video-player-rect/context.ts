import { createContext } from 'react';
import { RectResult } from '../../hooks/use-rect';

const initialState = new DOMRect();

export interface VideoPlayerRectContextValue {
    rect: RectResult;
}

export const VideoPlayerRectContext = createContext<
    VideoPlayerRectContextValue
>({
    rect: initialState,
});
