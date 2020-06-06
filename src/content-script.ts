import './common';

import { initLiveChat } from './app/live-chat-overlay';
import { waitForPlayerReady } from './youtube-dom-utils';
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

document.addEventListener('DOMContentLoaded', init);
