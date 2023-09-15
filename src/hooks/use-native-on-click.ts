import { type Accessor } from 'solid-js';

import { useNativeEventListener } from './use-native-event';

// Portal in SolidJS does not propagate events properly
// Need to resort to native events
export function useNativeOnClick<T extends HTMLElement | SVGElement>(
    element: Accessor<T | undefined>,
    onClick: Parameters<T['addEventListener']>[1],
): void {
    useNativeEventListener(element, 'click', onClick);
}
