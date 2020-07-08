import React, {
    useMemo,
    useRef,
    useState,
    useLayoutEffect,
    useCallback,
} from 'react';

import { useTimeout } from '@/hooks/use-timeout';
import { useRect } from '@/hooks/use-rect';
import { useVideoPlayerRect } from '@/hooks/use-video-player-rect';
import { useSettings } from '@/hooks/use-settings';
import classes from './index.scss';

import { UiChatItem } from '../types';

interface Props {
    children: React.ReactNode;
    chatItem: UiChatItem;
    onDone: (chatItem: UiChatItem) => void;
}

const MessageFlower: React.FC<Props> = ({ children, chatItem, onDone }) => {
    const [isFlowing, setIsFlowing] = useState(false);

    const ref = useRef<HTMLDivElement>(null);
    const rect = useRect(ref);
    const { settings } = useSettings();
    const timeout = useMemo(() => settings.flowTimeInSec * 1000, [
        settings.flowTimeInSec,
    ]);

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
            top: chatItem.lineNumber * lineHeight,
            fontSize: lineHeight,
            transform: isFlowing
                ? `translate3d(-${containerWidth + rect.width}px, 0, 0)`
                : 'translate3d(0, 0, 0)',
        }),
        [
            timeout,
            containerWidth,
            chatItem.lineNumber,
            lineHeight,
            isFlowing,
            rect.width,
        ],
    );

    const onMessageDone = useCallback(() => onDone(chatItem), [
        onDone,
        chatItem,
    ]);

    useTimeout(onMessageDone, timeout);

    useLayoutEffect(() => setIsFlowing(true), []);

    return (
        <div className={classes.container} style={style} ref={ref}>
            {children}
        </div>
    );
};

export default MessageFlower;
