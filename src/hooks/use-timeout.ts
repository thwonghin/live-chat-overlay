import { useEffect, useRef } from 'react';

// Ref: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export function useTimeout(callback: () => void, delay: number | null): void {
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
            const id = setTimeout(tick, delay);
            return (): void => {
                clearTimeout(id);
            };
        }

        return () => {
            // No clean up
        };
    }, [delay]);
}
