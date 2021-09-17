import './common';
import { browser } from 'webextension-polyfill-ts';

import { youtube } from '@/utils';
import { fetchInterceptor, settingsStorage } from '@/services';

import { injectLiveChatOverlay } from './app/live-chat-overlay';

async function init(): Promise<void> {
    await settingsStorage.storageInstance.init(browser);
    const detechFetchInterceptor = fetchInterceptor.attach(browser.runtime.id);
    const initData = await youtube.getInitData(browser.runtime.id);

    await youtube.waitForPlayerReady();

    const cleanupLiveChat = injectLiveChatOverlay(initData, browser);

    function cleanup(): void {
        cleanupLiveChat();
        detechFetchInterceptor();
    }

    window.addEventListener('unload', cleanup);
}

if (youtube.isInsideLiveChatFrame()) {
    document.addEventListener('DOMContentLoaded', init);
}
