import { makeAutoObservable } from 'mobx';
import browser from 'webextension-polyfill';

import { SettingsStore } from './settings';

class RootStore {
    public settingsStore: SettingsStore;

    constructor() {
        this.settingsStore = new SettingsStore(browser);
        makeAutoObservable(this);
    }
}

const rootStore = new RootStore();

export { rootStore };
