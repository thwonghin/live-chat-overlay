import { makeAutoObservable } from 'mobx';
import browser from 'webextension-polyfill';

import { LIVE_CHAT_API_INTERCEPT_EVENT } from '@/constants';
import { youtube } from '@/utils';

import { ChatItemStore } from './chat-item';
import { DebugInfoStore } from './debug-info';
import { SettingsStore } from './settings';
import { UiStore } from './ui';

export class RootStore {
    settingsStore = new SettingsStore(browser);
    debugInfoStore = new DebugInfoStore();
    uiStore = new UiStore();
    chatItemStore: ChatItemStore;

    constructor() {
        const videoEle = youtube.getVideoEle();
        const videoPlayerEle = youtube.getVideoPlayerEle();

        if (!videoEle) {
            throw new Error('Video element not found');
        }

        if (!videoPlayerEle) {
            throw new Error('Video player element not found');
        }

        this.chatItemStore = new ChatItemStore(
            LIVE_CHAT_API_INTERCEPT_EVENT,
            videoEle,
            videoPlayerEle,
            this.settingsStore,
            this.debugInfoStore,
        );
        makeAutoObservable(this);
    }
}

const rootStore = new RootStore();

export { rootStore };
