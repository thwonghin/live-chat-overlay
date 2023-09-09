import './common';
import browser from 'webextension-polyfill';

import { youtube, injectScript } from '@/utils';

import { injectLiveChatOverlay } from './app/live-chat-overlay';
import { createRootStore } from './stores';

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

    console.log('hihi');
    const store = await createRootStore(videoEle, videoPlayerEle);

    console.log('hihi2');
    const cleanupLiveChat = await injectLiveChatOverlay(
        initData,
        browser,
        store,
    );

    function cleanup(): void {
        cleanupLiveChat();
    }

    window.addEventListener('unload', cleanup);
}

document.addEventListener('DOMContentLoaded', init);
