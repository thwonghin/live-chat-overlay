import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { debugInfoActions } from '@/reducers/debug-info';
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
        () => dispatch(debugInfoActions.resetMetrics()),
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
            dispatch(debugInfoActions.startDebug());
        } else {
            dispatch(debugInfoActions.stopDebug());
        }
    }, [isActive, dispatch]);

    useEffect(() => {
        return () => {
            dispatch(debugInfoActions.reset());
        };
    }, [dispatch]);
}
