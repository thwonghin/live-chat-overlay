import type { RefObject } from 'react';
import { useState, useEffect } from 'react';

export function useClickOutside(refs: RefObject<HTMLElement>[]): boolean {
    const [isClickedOutside, setIsClickedOutside] = useState(false);

    useEffect(() => {
        function handleEvent(e: Event) {
            if (!e.target) {
                return;
            }
            setIsClickedOutside(
                !refs.some(
                    (ref) =>
                        ref.current?.contains(e.target as HTMLElement) ?? false,
                ),
            );
        }

        if (window.PointerEvent) {
            document.addEventListener('pointerdown', handleEvent);
        } else {
            document.addEventListener('mousedown', handleEvent);
            document.addEventListener('touchstart', handleEvent);
        }

        return () => {
            if (window.PointerEvent) {
                document.removeEventListener('pointerdown', handleEvent);
            } else {
                document.removeEventListener('mousedown', handleEvent);
                document.removeEventListener('touchstart', handleEvent);
            }
        };
    }, [refs]);

    return isClickedOutside;
}
