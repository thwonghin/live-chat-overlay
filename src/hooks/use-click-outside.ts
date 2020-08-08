import type { RefObject } from 'react';
import { useState, useEffect } from 'react';

interface UseClickOutsideParams {
    refs: RefObject<HTMLElement>[];
    doc: Document;
}

export function useClickOutside({ refs, doc }: UseClickOutsideParams): boolean {
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

        doc.addEventListener('mousedown', handleEvent);
        doc.addEventListener('touchstart', handleEvent);

        return () => {
            doc.removeEventListener('mousedown', handleEvent);
            doc.removeEventListener('touchstart', handleEvent);
        };
    }, [refs, doc]);

    return isClickedOutside;
}
