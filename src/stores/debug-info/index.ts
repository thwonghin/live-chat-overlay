import { makeAutoObservable } from 'mobx';

import { DebugInfoModel } from '@/models/debug-info';

export class DebugInfoStore {
    isDebugging = false;

    debugInfoModel = new DebugInfoModel();

    constructor() {
        makeAutoObservable(this);
    }

    resetMetrics() {
        this.debugInfoModel.reset();
    }

    reset() {
        this.resetMetrics();
        this.isDebugging = false;
    }
}
