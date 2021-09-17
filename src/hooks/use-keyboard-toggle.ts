import { useState, useCallback } from 'react';

import { useKeyboardEvent } from './use-keyboard-event';

interface UseKeyboardToggleParameters {
    shouldAlt: boolean;
    shouldCtrl: boolean;
    key: number;
    attached: HTMLElement;
}

interface UseKeyboardToggleResult {
    isActive: boolean;
}

export function useKeyboardToggle({
    shouldAlt,
    shouldCtrl,
    key,
    attached,
}: UseKeyboardToggleParameters): UseKeyboardToggleResult {
    const [isActive, setIsActive] = useState(false);

    const toggleActive = useCallback(() => {
        setIsActive((previousIsActive) => !previousIsActive);
    }, []);

    useKeyboardEvent({
        shouldAlt,
        shouldCtrl,
        key,
        attached,
        onChange: toggleActive,
    });

    return {
        isActive,
    };
}
