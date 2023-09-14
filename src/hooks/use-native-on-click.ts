import { type Accessor, createEffect, onCleanup } from 'solid-js';

// Portal in SolidJS does not propagate events properly
// Need to resort to native events
export function useNativeOnClick<T extends HTMLElement | SVGElement>(
    element: Accessor<T | undefined>,
    onClick: (event: MouseEvent) => void,
): void {
    createEffect(() => {
        (element() as HTMLElement | undefined)?.addEventListener(
            'click',
            onClick,
        );

        onCleanup(() => {
            (element() as HTMLElement | undefined)?.removeEventListener(
                'click',
                onClick,
            );
        });
    });
}
