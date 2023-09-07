import './common';
import browser from 'webextension-polyfill';

import { youtube, injectScript } from '@/utils';

import { injectLiveChatOverlay } from './app/live-chat-overlay';
import { RootStore } from './stores';

async function init(): Promise<void> {
    injectScript(browser.runtime.getURL('src/live-chat-fetch-interceptor.js'));

    const initData = await youtube.getInitData(
        browser.runtime.getURL('src/get-live-chat-init-data.js'),
    );

    await youtube.waitForPlayerReady();

    const videoPlayerEle = youtube.getVideoPlayerEle();
    if (!videoPlayerEle) {
        throw new Error('Video Player Ele not found');
    }

    const videoEle = youtube.getVideoEle();
    if (!videoEle) {
        throw new Error('Video Ele not found');
    }

    const store = new RootStore(videoEle, videoPlayerEle);
    await store.init();

    const cleanupLiveChat = await injectLiveChatOverlay(
        initData,
        browser,
        store,
    );

    function cleanup(): void {
        cleanupLiveChat();
        store.cleanup();
    }

    window.addEventListener('unload', cleanup);
}

document.addEventListener('DOMContentLoaded', init);
