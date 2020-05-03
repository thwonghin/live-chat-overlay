import React, {
    useEffect,
    useMemo,
    useRef,
    useState,
    useLayoutEffect,
    useCallback,
} from 'react';

import classes from './index.scss';
import { useRect } from '../../../hooks/use-rect';
import { UiChatItem } from '../../../reducers/chat-events/types';
import { useVideoPlayerRect } from '../../../hooks/use-video-player-rect';

interface Props {
    children: React.ReactNode;
    timeout: number;
    chatItem: UiChatItem;
    onTimeout: (chatItem: UiChatItem) => void;
}

export default function MessageFlower({
    children,
    timeout,
    chatItem,
    onTimeout,
}: Props): JSX.Element {
    const [isFlowing, setIsFlowing] = useState(false);

    const ref = useRef(null);
    const rect = useRect(ref);

    const videoPlayerRect = useVideoPlayerRect();
    const containerWidth = videoPlayerRect.width;
    const lineHeight = useMemo(() => videoPlayerRect.height / 15, [
        videoPlayerRect.height,
    ]);

    const style = useMemo<React.CSSProperties>(
        () => ({
            transitionDuration: `${timeout}ms`,
            left: containerWidth || 99999,
            top: chatItem.position.lineNumber * lineHeight,
            fontSize: lineHeight,
            transform: isFlowing
                ? `translateX(-${containerWidth + rect.width}px)`
                : 'translateX(0)',
        }),
        [
            timeout,
            containerWidth,
            chatItem.position.lineNumber,
            lineHeight,
            isFlowing,
            rect.width,
        ],
    );

    const onTimeoutCallback = useCallback(() => {
        onTimeout(chatItem);
    }, [onTimeout, chatItem]);

    useEffect(() => {
        const id = setTimeout(onTimeoutCallback, timeout);
        return (): void => clearTimeout(id);
    }, [onTimeoutCallback, timeout]);

    useLayoutEffect(() => setIsFlowing(true), []);

    return (
        <div className={classes.container} style={style} ref={ref}>
            {children}
        </div>
    );
}
