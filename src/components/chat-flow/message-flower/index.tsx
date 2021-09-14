import { useMemo, useRef, useState, useLayoutEffect } from 'react';
import styled from 'styled-components';

import { useTimeout, useRect, useSettings } from '@/hooks';

const Container = styled.div`
    position: absolute;
    top: 0;
    display: flex;
    flex-direction: row;
    white-space: nowrap;
    transition-timing-function: linear;
    transition-property: transform;
`;

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
    const timeout = useMemo(
        () => settings.flowTimeInSec * 1000,
        [settings.flowTimeInSec],
    );

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

    useLayoutEffect(() => {
        setIsFlowing(true);
    }, []);

    return (
        <Container ref={ref} style={style}>
            {children}
        </Container>
    );
};

export default MessageFlower;
