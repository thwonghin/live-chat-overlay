import browser from 'webextension-polyfill';

import { LIVE_CHAT_API_INTERCEPT_EVENT } from '@/constants';

import { ChatItemStore, createChatItemStore } from './chat-item';
import { DebugInfoStore, createDebugInfoStore } from './debug-info';
import { SettingsStore, createSettingsStore } from './settings';
import { UiStore, createUiStore } from './ui';

export type RootStore = {
    settingsStore: SettingsStore;
    debugInfoStore: DebugInfoStore;
    uiStore: UiStore;
    chatItemStore: ChatItemStore;
};

export const createRootStore = async (
    videoEle: HTMLVideoElement,
    videoPlayerEle: HTMLDivElement,
): Promise<RootStore> => {
    const settingsStore = await createSettingsStore(browser);
    const debugInfoStore = createDebugInfoStore();
    const uiStore = createUiStore(videoPlayerEle, videoEle);
    const chatItemStore = createChatItemStore(
        LIVE_CHAT_API_INTERCEPT_EVENT,
        uiStore,
        settingsStore,
        debugInfoStore,
    );

    return {
        settingsStore,
        debugInfoStore,
        uiStore,
        chatItemStore,
    };
};
