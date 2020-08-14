import './common';
import { browser } from 'webextension-polyfill-ts';

import { injectLiveChatOverlay } from './app/live-chat-overlay';
import {
    isInsideLiveChatFrame,
    waitForPlayerReady,
    getInitData,
} from './youtube-utils';
import { attachFetchInterceptor } from './services/fetch-interceptor';
import { SettingsStorage } from './services/settings-storage';

function injectStyles(): () => void {
    const path = browser.extension.getURL('content-script.css');

    const link = window.parent.document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = path;

    window.parent.document.head.appendChild(link);

    return () => window.parent.document.head.removeChild(link);
}

async function init(): Promise<void> {
    await SettingsStorage.init();
    const cleanupStyles = injectStyles();
    const detechFetchInterceptor = attachFetchInterceptor();
    const initData = await getInitData();

    await waitForPlayerReady();

    const cleanupLiveChat = injectLiveChatOverlay(initData);

    function cleanup(): void {
        cleanupLiveChat();
        detechFetchInterceptor();
        cleanupStyles();
    }

    window.addEventListener('unload', cleanup);
}

if (isInsideLiveChatFrame()) {
    document.addEventListener('DOMContentLoaded', init);
}
