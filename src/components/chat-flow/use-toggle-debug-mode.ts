import { useEffect } from 'react';

import { action, runInAction } from 'mobx';

import { useDebugInfoStore } from '@/contexts/debug-info';
import { useKeyboardToggle, useKeyboardEvent } from '@/hooks';

const D_KEY = 68;
const R_KEY = 82;

export function useToggleDebugMode(): void {
    const debugInfoStore = useDebugInfoStore();

    const { isActive } = useKeyboardToggle({
        shouldAlt: true,
        shouldCtrl: true,
        key: D_KEY,
        attached: window.parent.document.body,
    });

    const handleRefreshEvent = action(() => {
        debugInfoStore.resetMetrics();
    });

    useKeyboardEvent({
        shouldAlt: true,
        shouldCtrl: true,
        key: R_KEY,
        attached: window.parent.document.body,
        onChange: handleRefreshEvent,
    });

    useEffect(() => {
        runInAction(() => {
            if (isActive) {
                debugInfoStore.isDebugging = true;
            } else {
                debugInfoStore.isDebugging = false;
            }
        });
    }, [isActive, debugInfoStore]);

    useEffect(() => {
        return () => {
            runInAction(() => {
                debugInfoStore.reset();
            });
        };
    }, [debugInfoStore]);
}
