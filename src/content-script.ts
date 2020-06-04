import './common';

import { initLiveChat } from './app/live-chat-overlay';
import { waitForChatReady } from './youtube-dom-utils';

async function init(): Promise<void> {
    await waitForChatReady();
    const cleanupLiveChat = initLiveChat();

    function cleanup(): void {
        cleanupLiveChat();
    }

    window.addEventListener('unload', cleanup);
}

document.addEventListener('DOMContentLoaded', init);
