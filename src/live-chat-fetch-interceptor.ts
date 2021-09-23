import './common';
import { initInterceptor } from '@/services/fetch-interceptor';

import { LIVE_CHAT_API_INTERCEPT_EVENT } from './constants';
import { youtube } from './utils';

function init(): void {
    const revert = initInterceptor(
        LIVE_CHAT_API_INTERCEPT_EVENT,
        youtube.GET_LIVE_CHAT_URL,
    );

    window.addEventListener('unload', revert);
}

init();
