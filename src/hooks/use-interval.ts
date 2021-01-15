import { useEffect, useRef } from 'react';

// Ref: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export function useInterval(callback: () => void, delay: number | null): void {
    const savedCallback = useRef<() => void>();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current?.();
        }

        if (delay !== null) {
            const id = setInterval(tick, delay);
            return (): void => {
                clearInterval(id);
            };
        }

        return () => {
            // No clean up
        };
    }, [delay]);
}
