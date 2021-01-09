// eslint-disable-next-line import/no-unassigned-import
import './common';
import {browser} from 'webextension-polyfill-ts';

import {youtube} from '@/utils';
import {fetchInterceptor, settingsStorage} from '@/services';

import {injectLiveChatOverlay} from './app/live-chat-overlay';

function injectStyles(): () => void {
    const path = browser.extension.getURL('content-script.css');

    const link = window.parent.document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = path;

    window.parent.document.head.append(link);

    return () => {
        link.remove();
    };
}

async function init(): Promise<void> {
    await settingsStorage.storageInstance.init();
    const cleanupStyles = injectStyles();
    const detechFetchInterceptor = fetchInterceptor.attach();
    const initData = await youtube.getInitData();

    await youtube.waitForPlayerReady();

    const cleanupLiveChat = injectLiveChatOverlay(initData);

    function cleanup(): void {
        cleanupLiveChat();
        detechFetchInterceptor();
        cleanupStyles();
    }

    window.addEventListener('unload', cleanup);
}

if (youtube.isInsideLiveChatFrame()) {
    document.addEventListener('DOMContentLoaded', init);
}
