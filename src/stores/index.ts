import { makeAutoObservable } from 'mobx';
import browser from 'webextension-polyfill';

import { DebugInfoStore } from './debug-info';
import { SettingsStore } from './settings';

class RootStore {
    settingsStore = new SettingsStore(browser);

    debugInfoStore = new DebugInfoStore();

    constructor() {
        makeAutoObservable(this);
    }
}

const rootStore = new RootStore();

export { rootStore };
