import { createEffect, createSignal, onCleanup } from 'solid-js';

export function useIsEleHovering(ele: HTMLElement): boolean {
    const [isHovering, setIsHovering] = createSignal(false);

    function onMouseEnter(): void {
        setIsHovering(true);
    }

    function onMouseLeave(): void {
        setIsHovering(false);
    }

    createEffect(() => {
        ele.addEventListener('mouseenter', onMouseEnter);
        ele.addEventListener('mouseleave', onMouseLeave);
    });

    onCleanup(() => {
        ele.removeEventListener('mouseenter', onMouseEnter);
        ele.removeEventListener('mouseleave', onMouseLeave);
    });

    return isHovering();
}
