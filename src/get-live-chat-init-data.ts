import './common';
import { InitData } from '@/definitions/youtube';

import { LIVE_CHAT_INIT_DATA } from './constants';

function dispatchInitData(): void {
    // Window.ytInitialData is mutated, need to get from raw HTML
    const initialDataTag = [...document.querySelectorAll('script')].find(
        (tag) =>
            !tag.innerHTML.includes(LIVE_CHAT_INIT_DATA) &&
            tag.innerHTML.includes('window["ytInitialData"] ='),
    );

    if (!initialDataTag) {
        return;
    }

    const innerHTML = initialDataTag.innerHTML.trim();
    const startIndex = innerHTML.indexOf('{"responseContext"');
    const initData = innerHTML.slice(startIndex, -1);

    const event = new CustomEvent<{ data: InitData }>(LIVE_CHAT_INIT_DATA, {
        detail: {
            data: JSON.parse(initData) as InitData,
        },
    });

    setTimeout(() => window.dispatchEvent(event), 0);
}

dispatchInitData();
