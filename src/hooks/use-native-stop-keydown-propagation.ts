import type {RefObject} from 'react';
import {useEffect} from 'react';

export function useNativeStopKeydownPropagation(
    ref: RefObject<HTMLElement>,
): void {
    useEffect(() => {
        function stopPropagation(event: KeyboardEvent): void {
            event.stopPropagation();
        }

        const ele = ref.current;
        ele?.addEventListener('keydown', stopPropagation);

        return () => {
            ele?.removeEventListener('keydown', stopPropagation);
        };
    }, [ref]);
}
