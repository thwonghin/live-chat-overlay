import browser from 'webextension-polyfill';

import { LIVE_CHAT_API_INTERCEPT_EVENT } from '@/constants';
import { type InitData } from '@/definitions/youtube';

import { type ChatItemStore, createChatItemStore } from './chat-item';
import { type DebugInfoStore, createDebugInfoStore } from './debug-info';
import { type SettingsStore, createSettingsStore } from './settings';
import { type UiStore, createUiStore } from './ui';

export type RootStore = {
    settingsStore: SettingsStore;
    debugInfoStore: DebugInfoStore;
    uiStore: UiStore;
    chatItemStore: ChatItemStore;
    init: (initData: InitData) => void;
    cleanup: () => void;
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

    function init(initData: InitData) {
        chatItemStore.importInitData(initData);
    }

    function cleanup() {
        settingsStore.cleanup?.();
        debugInfoStore.cleanup?.();
        uiStore.cleanup?.();
        chatItemStore.cleanup?.();
    }

    return {
        init,
        cleanup,
        settingsStore,
        debugInfoStore,
        uiStore,
        chatItemStore,
    };
};
