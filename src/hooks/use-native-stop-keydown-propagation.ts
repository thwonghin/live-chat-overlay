import { createEffect, onCleanup } from 'solid-js';

export function useNativeStopKeydownPropagation(element?: HTMLElement): void {
    function stopPropagation(event: KeyboardEvent): void {
        event.stopPropagation();
    }

    createEffect(() => {
        element?.addEventListener('keydown', stopPropagation);
        onCleanup(() => {
            element?.removeEventListener('keydown', stopPropagation);
        });
    });
}
