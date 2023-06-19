import { makeAutoObservable } from 'mobx';
import browser from 'webextension-polyfill';

import { LIVE_CHAT_API_INTERCEPT_EVENT } from '@/constants';

import { ChatItemStore } from './chat-item';
import { DebugInfoStore } from './debug-info';
import { SettingsStore } from './settings';
import { UiStore } from './ui';

export class RootStore {
    settingsStore = new SettingsStore(browser);
    debugInfoStore = new DebugInfoStore();
    uiStore: UiStore;
    chatItemStore: ChatItemStore;

    constructor(videoEle: HTMLVideoElement, videoPlayerEle: HTMLDivElement) {
        this.uiStore = new UiStore(videoPlayerEle, videoEle);
        this.chatItemStore = new ChatItemStore(
            LIVE_CHAT_API_INTERCEPT_EVENT,
            this.uiStore,
            this.settingsStore,
            this.debugInfoStore,
        );
        makeAutoObservable(this);
    }

    async init() {
        await this.settingsStore.init();
        this.uiStore.init();
        this.chatItemStore.init();
        this.debugInfoStore.init();
    }

    cleanup() {
        this.settingsStore.cleanup();
        this.uiStore.cleanup();
        this.chatItemStore.cleanup();
        this.debugInfoStore.cleanup();
    }
}
