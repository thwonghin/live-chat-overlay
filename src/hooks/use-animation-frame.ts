import { useRef, useEffect } from 'react';

// Ref: https://codesandbox.io/s/requestanimationframe-with-hooks-0kzh3?from-embed=&file=/src/index.js:545-1396
export function useAnimationFrame<T>(callback: (delta: number) => T): void {
    // Use useRef for mutable variables that we want to persist
    // without triggering a re-render on their change
    const requestRef = useRef<number>();
    const previousTimeRef = useRef<number>();
    /**
     * The callback function is automatically passed a timestamp indicating
     * the precise time requestAnimationFrame() was called.
     */

    useEffect(() => {
        const animate = (time: number) => {
            if (previousTimeRef.current !== undefined) {
                const deltaTime = time - previousTimeRef.current;
                callback(deltaTime);
            }
            previousTimeRef.current = time;
            requestRef.current = requestAnimationFrame(animate);
        };
        requestRef.current = requestAnimationFrame(animate);
        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [callback]); // Make sure the effect runs only once
}
