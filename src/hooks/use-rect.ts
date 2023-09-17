import { type Accessor, createEffect, createSignal, onCleanup } from 'solid-js';

export type RectResult = {
    height: number;
    width: number;
};

function getRect<T extends HTMLElement>(element?: T): RectResult {
    let rect: RectResult = {
        height: 0,
        width: 0,
    };
    if (element) rect = element.getBoundingClientRect();
    return rect;
}

export function useRect<T extends HTMLElement>(
    ele: Accessor<T | undefined>,
): Accessor<RectResult> {
    const [rect, setRect] = createSignal<RectResult>(getRect(ele()));

    function handleResize() {
        setTimeout(() => {
            setRect(getRect(ele()));
        });
    }

    createEffect(() => {
        const element = ele();
        if (!element) {
            return;
        }

        const resizeObserver = new ResizeObserver(() => {
            handleResize();
        });
        resizeObserver.observe(element);

        handleResize();

        onCleanup(() => {
            resizeObserver?.disconnect();
        });
    });

    return rect;
}
