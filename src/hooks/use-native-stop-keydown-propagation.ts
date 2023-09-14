import { type Accessor, createEffect, onCleanup } from 'solid-js';

export function useNativeStopKeydownPropagation(
    element: Accessor<HTMLElement | undefined>,
): void {
    function stopPropagation(event: KeyboardEvent): void {
        event.stopPropagation();
    }

    createEffect(() => {
        element()?.addEventListener('keydown', stopPropagation);
        onCleanup(() => {
            element()?.removeEventListener('keydown', stopPropagation);
        });
    });
}
