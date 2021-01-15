import type { RefObject } from 'react';
import { useState, useEffect } from 'react';

interface UseClickOutsideParameters {
    refs: Array<RefObject<HTMLElement>>;
    doc: Document;
}

export function useClickOutside({
    refs,
    doc,
}: UseClickOutsideParameters): boolean {
    const [isClickedOutside, setIsClickedOutside] = useState(false);

    useEffect(() => {
        function handleEvent(event: Event) {
            if (!event.target) {
                return;
            }

            setIsClickedOutside(
                !refs.some(
                    (ref) =>
                        ref.current?.contains(event.target as HTMLElement) ??
                        false,
                ),
            );
        }

        doc.addEventListener('mousedown', handleEvent);

        return () => {
            doc.removeEventListener('mousedown', handleEvent);
        };
    }, [refs, doc]);

    return isClickedOutside;
}
