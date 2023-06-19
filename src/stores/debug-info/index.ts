import { makeAutoObservable, runInAction } from 'mobx';

import { DebugInfoModel } from '@/models/debug-info';
import { attachKeydownEventListener } from '@/utils';

export class DebugInfoStore {
    isDebugging = false;

    debugInfoModel = new DebugInfoModel();

    private disposeKeyboardListener: (() => void) | undefined = undefined;

    constructor() {
        makeAutoObservable(this);
    }

    init() {
        this.disposeKeyboardListener = this.attachKeyboardEvent();
    }

    cleanup() {
        this.disposeKeyboardListener?.();
    }

    resetMetrics() {
        this.debugInfoModel.reset();
    }

    reset() {
        this.resetMetrics();
        this.isDebugging = false;
    }

    private attachKeyboardEvent(): () => void {
        return attachKeydownEventListener({
            withAlt: true,
            withCtrl: true,
            key: 'd',
            domToAttach: window.parent.document.body,
            callback: this.toggleIsDebugging,
        });
    }

    private readonly toggleIsDebugging = (): void => {
        runInAction(() => {
            this.isDebugging = !this.isDebugging;
        });
    };
}
