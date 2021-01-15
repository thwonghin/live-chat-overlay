import { useEffect } from 'react';

interface UseKeyboardEventParameters {
    shouldAlt: boolean;
    shouldCtrl: boolean;
    key: number;
    attached: HTMLElement;
    onChange: () => void;
}

export function useKeyboardEvent({
    shouldAlt,
    shouldCtrl,
    key,
    attached,
    onChange,
}: UseKeyboardEventParameters): void {
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

            onChange();
        };

        attached.addEventListener('keydown', handleKeyDown);

        return () => {
            attached.removeEventListener('keydown', handleKeyDown);
        };
    }, [attached, key, shouldAlt, shouldCtrl, onChange]);
}
