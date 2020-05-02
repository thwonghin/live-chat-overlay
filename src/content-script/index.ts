import '../common';

import { initLiveChat } from './live-chat-cover';
import { waitForChatReady } from './utils';

async function init(): Promise<void> {
    await waitForChatReady();
    const cleanupLiveChat = initLiveChat();

    function cleanup() {
        cleanupLiveChat();
    }

    window.addEventListener('unload', cleanup);
}

document.addEventListener('DOMContentLoaded', () => {
    init();
});
