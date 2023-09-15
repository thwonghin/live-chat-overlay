import { type Accessor, createEffect, onCleanup } from 'solid-js';

// Portal in SolidJS does not propagate events properly
// Need to resort to native events
export function useNativeEventListener<T extends HTMLElement | SVGElement>(
    element: Accessor<T | undefined>,
    event: Parameters<T['addEventListener']>[0],
    handler: Parameters<T['addEventListener']>[1],
    options?: Parameters<T['addEventListener']>[2],
): void {
    createEffect(() => {
        element()?.addEventListener(event, handler, options);

        onCleanup(() => {
            element()?.removeEventListener(event, handler, options);
        });
    });
}
