import { type InitData } from '@/definitions/youtube';
import { type ChatEventDetail } from '@/services/fetch-interceptor';

import { type ChatItemStore, createChatItemStore } from './chat-item';
import { type DebugInfoStore, createDebugInfoStore } from './debug-info';
import { SettingsStore } from './settings';
import { type UiStore, createUiStore } from './ui';

export type RootStore = {
    settingsStore: SettingsStore;
    debugInfoStore: DebugInfoStore;
    uiStore: UiStore;
    chatItemStore: ChatItemStore;
    cleanup: () => void;
    init: () => Promise<void>;
};

export const createRootStore = (
    videoEle: HTMLVideoElement,
    videoPlayerEle: HTMLDivElement,
    initData: InitData,
    attachChatEvent: (callback: (e: ChatEventDetail) => void) => () => void,
): RootStore => {
    const settingsStore = new SettingsStore();
    const debugInfoStore = createDebugInfoStore();
    const uiStore = createUiStore(videoPlayerEle, videoEle);
    const chatItemStore = createChatItemStore(
        attachChatEvent,
        uiStore,
        settingsStore,
        debugInfoStore,
        initData,
    );

    function cleanup() {
        settingsStore.cleanup?.();
        debugInfoStore.cleanup?.();
        uiStore.cleanup?.();
        chatItemStore.cleanup?.();
    }

    async function init() {
        await settingsStore.init();
    }

    return {
        cleanup,
        settingsStore,
        debugInfoStore,
        uiStore,
        chatItemStore,
        init,
    };
};
