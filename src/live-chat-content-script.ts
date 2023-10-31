import { CHAT_START_EVENT } from './constants';
import { injectScript } from './utils';
import { logInfo } from './utils/logger';

function start() {
    logInfo('starting from live chat iframe');
    injectScript(chrome.runtime.getURL('src/live-chat-fetch-interceptor.js'));
    const event = new CustomEvent(`${chrome.runtime.id}-${CHAT_START_EVENT}`);
    window.parent.window.dispatchEvent(event);
}

document.addEventListener('DOMContentLoaded', start);
