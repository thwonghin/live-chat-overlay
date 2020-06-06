import './common';

import { initLiveChat } from './app/live-chat-overlay';
import { isInsideLiveChatFrame, waitForPlayerReady } from './youtube-utils';
import { attachXhrInterceptor } from './services/xhr-interceptor';

async function init(): Promise<void> {
    const detechXhrInterceptor = attachXhrInterceptor();
    await waitForPlayerReady();

    const cleanupLiveChat = initLiveChat();

    function cleanup(): void {
        cleanupLiveChat();
        detechXhrInterceptor();
    }

    window.addEventListener('unload', cleanup);
}

if (isInsideLiveChatFrame()) {
    document.addEventListener('DOMContentLoaded', init);
}
