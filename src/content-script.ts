import './common';

import { initLiveChat } from './app/live-chat-overlay';
import { waitForChatReady } from './youtube-dom-utils';
import { attachXhrInterceptor } from './services/xhr-interceptor';

async function init(): Promise<void> {
    const detechXhrInterceptor = attachXhrInterceptor();

    await waitForChatReady();
    const cleanupLiveChat = initLiveChat();

    function cleanup(): void {
        cleanupLiveChat();
        detechXhrInterceptor();
    }

    window.addEventListener('unload', cleanup);
}

document.addEventListener('DOMContentLoaded', init);
