import './common';

import { injectLiveChatOverlay } from './app/live-chat-overlay';
import { injectToggleBtn } from './app/toggle-btn';
import {
    isInsideLiveChatFrame,
    waitForPlayerReady,
    getInitData,
} from './youtube-utils';
import { attachXhrInterceptor } from './services/xhr-interceptor';

async function init(): Promise<void> {
    const detechXhrInterceptor = attachXhrInterceptor();
    await waitForPlayerReady();

    const initData = await getInitData();

    const cleanupLiveChat = injectLiveChatOverlay(initData);
    const cleanupToggleBtn = injectToggleBtn();

    function cleanup(): void {
        cleanupLiveChat();
        cleanupToggleBtn();
        detechXhrInterceptor();
    }

    window.addEventListener('unload', cleanup);
}

if (isInsideLiveChatFrame()) {
    document.addEventListener('DOMContentLoaded', init);
}
