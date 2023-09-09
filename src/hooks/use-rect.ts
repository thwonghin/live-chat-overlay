// Source: https://gist.github.com/morajabi/523d7a642d8c0a2f71fcfa0d8b3d2846

import { createEffect, createSignal, onCleanup } from 'solid-js';

export type RectResult = {
    bottom: number;
    height: number;
    left: number;
    right: number;
    top: number;
    width: number;
};

function getRect<T extends HTMLElement>(element?: T): RectResult {
    let rect: RectResult = {
        bottom: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0,
        width: 0,
    };
    if (element) rect = element.getBoundingClientRect();
    return rect;
}

export function useRect<T extends HTMLElement>(ele?: T): RectResult {
    const [rect, setRect] = createSignal<RectResult>(getRect(ele));
    let resizeObserver: ResizeObserver | undefined = undefined;

    function handleResize() {
        setTimeout(() => {
            setRect(getRect(ele));
        });
    }

    createEffect(() => {
        if (!ele) {
            return;
        }

        if (typeof ResizeObserver === 'function') {
            resizeObserver = new ResizeObserver(() => {
                handleResize();
            });
            resizeObserver.observe(ele);
        }
        handleResize();
    });

    onCleanup(() => {
        resizeObserver?.disconnect();
    });

    return rect();
}
