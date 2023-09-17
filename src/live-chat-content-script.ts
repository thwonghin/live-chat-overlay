import './common';
import browser from 'webextension-polyfill';

import { CHAT_END_EVENT, CHAT_START_EVENT } from './constants';
import { injectScript } from './utils';
import { logInfo } from './utils/logger';

function start() {
    logInfo('starting from live chat iframe');
    injectScript(browser.runtime.getURL('src/live-chat-fetch-interceptor.js'));
    const event = new CustomEvent(`${browser.runtime.id}-${CHAT_START_EVENT}`);
    window.parent.window.dispatchEvent(event);
}

function end() {
    logInfo('ending from live chat iframe');
    const event = new CustomEvent(`${browser.runtime.id}-${CHAT_END_EVENT}`);
    window.parent.window.dispatchEvent(event);
}

document.addEventListener('DOMContentLoaded', start);
window.addEventListener('unload', end);
