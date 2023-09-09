import { DebugInfoModel, createDebugInfoModel } from '@/models/debug-info';
import { attachKeydownEventListener } from '@/utils';
import { createStore, produce } from 'solid-js/store';
import { onCleanup } from 'solid-js';

export type DebugInfoStoreValues = {
    isDebugging: boolean;
    debugInfoModel: DebugInfoModel;
};

export type DebugInfoStore = {
    resetMetrics: () => void;
    reset: () => void;
} & DebugInfoStoreValues;

export const createDebugInfoStore = (): DebugInfoStore => {
    const [state, setState] = createStore<DebugInfoStoreValues>({
        isDebugging: false,
        debugInfoModel: createDebugInfoModel(),
    });

    function toggleIsDebugging() {
        setState(
            produce((s) => {
                s.isDebugging = !s.isDebugging;
            }),
        );
    }

    function resetMetrics() {
        setState(
            produce((s) => {
                s.debugInfoModel.reset();
            }),
        );
    }

    function reset() {
        setState(
            produce((s) => {
                s.isDebugging = false;
                resetMetrics();
            }),
        );
    }

    const disposeKeyboardListener = attachKeydownEventListener({
        withAlt: true,
        withCtrl: true,
        key: 'd',
        domToAttach: window.parent.document.body,
        callback: toggleIsDebugging,
    });

    onCleanup(() => {
        disposeKeyboardListener();
    });

    return {
        ...state,
        resetMetrics,
        reset,
    };
};
