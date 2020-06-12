import { useState, useCallback } from 'react';
import { useKeyboardEvent } from './use-keyboard-event';

interface UseKeyboardToggleParams {
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
}: UseKeyboardToggleParams): UseKeyboardToggleResult {
    const [isActive, setIsActive] = useState(false);

    const toggleActive = useCallback(
        () => setIsActive((prevIsActive) => !prevIsActive),
        [],
    );

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
