import './common';

import { injectLiveChatOverlay } from './app/live-chat-overlay';
import { injectToggleBtn } from './app/toggle-btn';
import { isInsideLiveChatFrame, waitForPlayerReady } from './youtube-utils';
import { attachXhrInterceptor } from './services/xhr-interceptor';

async function init(): Promise<void> {
    const detechXhrInterceptor = attachXhrInterceptor();
    await waitForPlayerReady();

    const cleanupLiveChat = injectLiveChatOverlay();
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
