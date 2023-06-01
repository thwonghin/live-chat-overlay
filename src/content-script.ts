import './common';
import browser from 'webextension-polyfill';

import { settingsStorage } from '@/services';
import { youtube, injectScript } from '@/utils';

import { injectLiveChatOverlay } from './app/live-chat-overlay';

async function init(): Promise<void> {
    await settingsStorage.storageInstance.init(browser);
    injectScript(browser.runtime.getURL('src/live-chat-fetch-interceptor.js'));

    const initData = await youtube.getInitData(
        browser.runtime.getURL('src/get-live-chat-init-data.js'),
    );

    await youtube.waitForPlayerReady();

    const cleanupLiveChat = injectLiveChatOverlay(initData, browser);

    function cleanup(): void {
        cleanupLiveChat();
    }

    window.addEventListener('unload', cleanup);
}

document.addEventListener('DOMContentLoaded', init);
