import { useEffect, useCallback } from 'react';

import { useDispatch } from 'react-redux';

import { debugInfo } from '@/features';
import { useKeyboardToggle, useKeyboardEvent } from '@/hooks';

const dKey = 68;
const rKey = 82;

export function useToggleDebugMode(): void {
    const dispatch = useDispatch();

    const { isActive } = useKeyboardToggle({
        shouldAlt: true,
        shouldCtrl: true,
        key: dKey,
        attached: window.parent.document.body,
    });

    const handleRefreshEvent = useCallback(
        () => dispatch(debugInfo.actions.resetMetrics()),
        [dispatch],
    );

    useKeyboardEvent({
        shouldAlt: true,
        shouldCtrl: true,
        key: rKey,
        attached: window.parent.document.body,
        onChange: handleRefreshEvent,
    });

    useEffect(() => {
        if (isActive) {
            dispatch(debugInfo.actions.startDebug());
        } else {
            dispatch(debugInfo.actions.stopDebug());
        }
    }, [isActive, dispatch]);

    useEffect(() => {
        return () => {
            dispatch(debugInfo.actions.reset());
        };
    }, [dispatch]);
}
