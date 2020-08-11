import React, { useMemo, useRef, useState, useLayoutEffect } from 'react';

import { useTimeout, useRect, useSettings } from '@/hooks';
import classes from './index.scss';

interface Props {
    children: React.ReactNode;
    top: number;
    containerWidth: number;
    onDone: () => void;
}

const MessageFlower: React.FC<Props> = ({
    children,
    top,
    containerWidth,
    onDone,
}) => {
    const [isFlowing, setIsFlowing] = useState(false);

    const ref = useRef<HTMLDivElement>(null);
    const rect = useRect(ref);
    const { settings } = useSettings();
    const timeout = useMemo(() => settings.flowTimeInSec * 1000, [
        settings.flowTimeInSec,
    ]);

    const style = useMemo<React.CSSProperties>(
        () => ({
            transitionDuration: `${timeout}ms`,
            left: containerWidth || 99999,
            top,
            transform: isFlowing
                ? `translate3d(-${containerWidth + rect.width}px, 0, 0)`
                : 'translate3d(0, 0, 0)',
        }),
        [timeout, containerWidth, top, isFlowing, rect.width],
    );

    useTimeout(onDone, timeout);

    useLayoutEffect(() => setIsFlowing(true), []);

    return (
        <div className={classes.container} style={style} ref={ref}>
            {children}
        </div>
    );
};

export default MessageFlower;
