import '../common';

import { initLiveChat } from './live-chat-overlay';
import { waitForChatReady } from './utils';

async function init(): Promise<void> {
    await waitForChatReady();
    const cleanupLiveChat = initLiveChat();

    function cleanup(): void {
        cleanupLiveChat();
    }

    window.addEventListener('unload', cleanup);
}

document.addEventListener('DOMContentLoaded', () => {
    init();
});
