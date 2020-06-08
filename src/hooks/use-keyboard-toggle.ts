import { useState, useEffect } from 'react';

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

    useEffect(() => {
        const handleKeyDown = (ev: KeyboardEvent) => {
            if (shouldAlt && !ev.altKey) {
                return;
            }
            if (shouldCtrl && !ev.ctrlKey) {
                return;
            }
            if (key !== ev.keyCode) {
                return;
            }
            setIsActive((value) => !value);
        };
        attached.addEventListener('keydown', handleKeyDown);

        return () => attached.removeEventListener('keydown', handleKeyDown);
    }, [attached, key, shouldAlt, shouldCtrl]);

    return {
        isActive,
    };
}
