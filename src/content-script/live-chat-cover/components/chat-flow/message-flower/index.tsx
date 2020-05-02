import React, {
    useEffect,
    useMemo,
    useRef,
    useState,
    useLayoutEffect,
} from 'react';

import classes from './index.css';
import { useRect } from '../../../hooks/use-rect';

interface Props {
    children: JSX.Element;
    timeout: number;
    onTimeout: () => void;
    containerWidth: number;
}

export default function MessageFlower({
    children,
    timeout,
    onTimeout,
    containerWidth,
}: Props): JSX.Element {
    const [isFlowing, setIsFlowing] = useState(false);

    const ref = useRef(null);

    const rect = useRect(ref);

    useEffect(() => {
        setTimeout(onTimeout, timeout);
    }, [onTimeout, timeout]);

    const style = useMemo<React.CSSProperties>(
        () => ({
            transitionDuration: `${timeout}ms`,
            left: -rect.width || -99999,
            transform: isFlowing
                ? `translateX(${containerWidth + rect.width}px)`
                : 'translateX(0)',
        }),
        [containerWidth, isFlowing, rect.width, timeout],
    );

    useLayoutEffect(() => setIsFlowing(true), []);

    return (
        <div className={classes.container} style={style} ref={ref}>
            {children}
        </div>
    );
}
