import { type InitData } from '@/definitions/youtube';
import { type ChatEventDetail } from '@/services/fetch-interceptor';

import { ChatItemStore } from './chat-item';
import { DebugInfoStore } from './debug-info';
import { SettingsStore } from './settings';
import { UiStore } from './ui';

export type RootStore = {
    settingsStore: SettingsStore;
    debugInfoStore: DebugInfoStore;
    uiStore: UiStore;
    chatItemStore: ChatItemStore;
    cleanup: () => void;
    init: (
        initData: InitData,
        attachChatEvent: (callback: (e: ChatEventDetail) => void) => () => void,
    ) => Promise<void>;
};

export const createRootStore = (
    videoEle: HTMLVideoElement,
    videoPlayerEle: HTMLDivElement,
): RootStore => {
    const settingsStore = new SettingsStore();
    const debugInfoStore = new DebugInfoStore();
    const uiStore = new UiStore(videoPlayerEle, videoEle, settingsStore);
    const chatItemStore = new ChatItemStore(
        uiStore,
        settingsStore,
        debugInfoStore,
    );

    function cleanup() {
        settingsStore.cleanup();
        debugInfoStore.cleanup();
        uiStore.cleanup();
        chatItemStore.cleanup?.();
    }

    async function init(
        initData: InitData,
        attachChatEvent: (callback: (e: ChatEventDetail) => void) => () => void,
    ) {
        await settingsStore.init();
        debugInfoStore.init();
        uiStore.init();
        await chatItemStore.init(attachChatEvent, initData);
    }

    return {
        settingsStore,
        debugInfoStore,
        uiStore,
        chatItemStore,
        init,
        cleanup,
    };
};
