import '../common';

import { initLiveChat } from './live-chat-cover';
import { initChatEvent } from './controllers/chat-event';
import { waitForChatReady } from './utils';

async function init(): Promise<void> {
    await waitForChatReady();
    const cleanupLiveChat = initLiveChat();
    const cleanupChatEvent = initChatEvent();

    function cleanup() {
        cleanupChatEvent();
        cleanupLiveChat();
    }

    window.addEventListener('unload', cleanup);
}

document.addEventListener('DOMContentLoaded', () => {
    init();
});
