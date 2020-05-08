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
import { useSettings } from '../../../hooks/use-settings';

interface Props {
    children: React.ReactNode;
    chatItem: UiChatItem;
    onTimeout: (chatItem: UiChatItem) => void;
}

const MessageFlower: React.FC<Props> = ({ children, chatItem, onTimeout }) => {
    const [isFlowing, setIsFlowing] = useState(false);

    const ref = useRef(null);
    const rect = useRect(ref);
    const settings = useSettings();
    const timeout = settings.flowTimeInSec * 1000;

    const videoPlayerRect = useVideoPlayerRect();
    const containerWidth = videoPlayerRect.width;
    const lineHeight = useMemo(
        () => videoPlayerRect.height / settings.numberOfLines,
        [settings.numberOfLines, videoPlayerRect.height],
    );

    const style = useMemo<React.CSSProperties>(
        () => ({
            transitionDuration: `${timeout}ms`,
            left: containerWidth || 99999,
            top: chatItem.position.lineNumber * lineHeight,
            fontSize: lineHeight,
            willChange: 'transform',
            transform: isFlowing
                ? `translate3d(-${containerWidth + rect.width}px, 0, 0)`
                : 'translate3d(0, 0, 0)',
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
};

export default MessageFlower;
