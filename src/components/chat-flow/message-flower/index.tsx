import { useMemo, useRef, useState, useLayoutEffect } from 'react';

import { observer } from 'mobx-react-lite';
import { styled } from 'styled-components';

import { useStore } from '@/contexts/root-store';
import { useRect } from '@/hooks';

const Container = styled.div`
    position: absolute;
    top: 0;
    display: flex;
    flex-direction: row;
    white-space: nowrap;
    transition-timing-function: linear;
    transition-property: transform;
`;

type Props = {
    children: React.ReactNode;
    top: number;
    containerWidth: number;
};

const MessageFlower: React.FC<Props> = observer(
    ({ children, top, containerWidth }) => {
        const [isFlowing, setIsFlowing] = useState(false);

        const ref = useRef<HTMLDivElement>(null);
        const rect = useRect(ref);
        const {
            settingsStore: { settings },
        } = useStore();
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

        useLayoutEffect(() => {
            setIsFlowing(true);
        }, []);

        return (
            <Container ref={ref} style={style}>
                {children}
            </Container>
        );
    },
);

export default MessageFlower;
