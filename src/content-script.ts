import { waitForValue, youtube } from '@/utils';

import { injectLiveChatOverlay } from './app/live-chat-overlay';
import { CHAT_START_EVENT, LIVE_CHAT_API_INTERCEPT_EVENT } from './constants';
import { type InitData } from './definitions/youtube';
import { type ChatEventDetail } from './services/fetch-interceptor';
import { createRootStore } from './stores';
import { createError, logDebug, logInfo } from './utils/logger';

function getChatFrame() {
    const chatFrame = document.getElementById(
        'chatframe',
    ) as HTMLIFrameElement | null;
    if (!chatFrame?.contentDocument) {
        throw createError('Missing chat frame');
    }

    return {
        document: chatFrame.contentDocument,
        iframe: chatFrame,
    };
}

async function getInitData(doc: Document): Promise<InitData> {
    function getData() {
        const initialDataTag = [...doc.querySelectorAll('script')].find((tag) =>
            tag.innerHTML.includes('window["ytInitialData"] ='),
        );

        if (!initialDataTag) {
            return null;
        }

        const innerHtml = initialDataTag.innerHTML.trim();
        const startIndex = innerHtml.indexOf('{"responseContext"');
        return JSON.parse(innerHtml.slice(startIndex, -1)) as InitData;
    }

    return waitForValue(getData, () => createError('init data not found'));
}

async function init() {
    logInfo('initiating in main player page');
    const chatFrame = getChatFrame();

    function attachChatEvent(callback: (e: ChatEventDetail) => void) {
        function listener(e: Event) {
            callback((e as CustomEvent<ChatEventDetail>).detail);
        }

        chatFrame.iframe.contentWindow?.addEventListener(
            LIVE_CHAT_API_INTERCEPT_EVENT,
            listener,
        );

        return () => {
            chatFrame.iframe.contentWindow?.removeEventListener(
                LIVE_CHAT_API_INTERCEPT_EVENT,
                listener,
            );
        };
    }

    logDebug('Getting init data');
    const initData = await getInitData(chatFrame.document);
    logDebug('Finish getting init data', initData);

    logDebug('Waiting for player ready');
    await youtube.waitForPlayerReady();

    const videoPlayerEle = youtube.getVideoPlayerEle();
    if (!videoPlayerEle) {
        throw createError('Video Player Ele not found');
    }

    const videoEle = youtube.getVideoEle();
    if (!videoEle) {
        throw createError('Video Ele not found');
    }

    const store = createRootStore(videoEle, videoPlayerEle);
    logDebug('Initiating the store');
    await store.init(initData, attachChatEvent);

    logDebug('Injecting the live chat overlay');
    const cleanupLiveChat = await injectLiveChatOverlay(store);

    const handleMessage: Parameters<
        typeof chrome.runtime.onMessage.addListener
    >[0] = (request) => {
        if (request.message === 'urlChanged') {
            logInfo('cleaning up in main player page');
            store.cleanup();
            cleanupLiveChat();
            chrome.runtime.onMessage.removeListener(handleMessage);
        }
    };

    chrome.runtime.onMessage.addListener(handleMessage);
}

window.addEventListener(`${chrome.runtime.id}-${CHAT_START_EVENT}`, init);

logInfo('injected script from', window.location.href);
