import './common';
import browser from 'webextension-polyfill';

import { CHAT_END_EVENT, CHAT_START_EVENT } from './constants';
import { injectScript } from './utils';

function start() {
    injectScript(browser.runtime.getURL('src/live-chat-fetch-interceptor.js'));
    const event = new CustomEvent(`${browser.runtime.id}-${CHAT_START_EVENT}`);
    window.parent.window.dispatchEvent(event);
}

function end() {
    const event = new CustomEvent(`${browser.runtime.id}-${CHAT_END_EVENT}`);
    window.parent.window.dispatchEvent(event);
}

document.addEventListener('DOMContentLoaded', start);
window.addEventListener('unload', end);
