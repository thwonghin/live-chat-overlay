import './common';

import { injectLiveChatOverlay } from './app/live-chat-overlay';
import { injectPlayerControl } from './app/player-control';
import {
    isInsideLiveChatFrame,
    waitForPlayerReady,
    getInitData,
} from './youtube-utils';
import { attachFetchInterceptor } from './services/fetch-interceptor';

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
    const cleanupStyles = injectStyles();
    const detechFetchInterceptor = attachFetchInterceptor();
    const initData = await getInitData();

    await waitForPlayerReady();

    const cleanupPlayerControl = injectPlayerControl();
    const cleanupLiveChat = injectLiveChatOverlay(initData);

    function cleanup(): void {
        cleanupPlayerControl();
        cleanupLiveChat();
        detechFetchInterceptor();
        cleanupStyles();
    }

    window.addEventListener('unload', cleanup);
}

if (isInsideLiveChatFrame()) {
    document.addEventListener('DOMContentLoaded', init);
}
