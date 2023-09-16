import './common';
import browser from 'webextension-polyfill';

import { youtube } from '@/utils';

import { injectLiveChatOverlay } from './app/live-chat-overlay';
import {
    CHAT_END_EVENT,
    CHAT_START_EVENT,
    LIVE_CHAT_API_INTERCEPT_EVENT,
} from './constants';
import { type InitData } from './definitions/youtube';
import { type ChatEventDetail } from './services/fetch-interceptor';
import { createRootStore } from './stores';

function getChatFrameDocument() {
    const chatFrame = document.getElementById(
        'chatframe',
    ) as HTMLIFrameElement | null;
    if (!chatFrame) {
        return null;
    }

    const chatFrameDocument = chatFrame.contentDocument;
    if (!chatFrameDocument?.body?.childElementCount) {
        return null;
    }

    return {
        document: chatFrameDocument,
        iframe: chatFrame,
    };
}

async function getOrWatchForChatFrameDocument(): Promise<{
    iframe: HTMLIFrameElement;
    document: Document;
}> {
    return new Promise((resolve, reject) => {
        const chatFrameDocument = getChatFrameDocument();
        if (chatFrameDocument) {
            resolve(chatFrameDocument);
            return;
        }

        let retryTimeInMs = 0;

        const interval = setInterval(() => {
            const chatFrameDocument = getChatFrameDocument();
            if (chatFrameDocument) {
                resolve(chatFrameDocument);
                clearInterval(interval);
                return;
            }

            retryTimeInMs += 100;
            if (retryTimeInMs >= 600000) {
                reject(new Error('Chat Frame not found.'));
            }
        }, 100);
    });
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

    return new Promise((resolve, reject) => {
        const data = getData();
        if (data) {
            resolve(data);
            return;
        }

        let retryTimeInMs = 0;

        const interval = setInterval(() => {
            const data = getData();
            if (data) {
                resolve(data);
                clearInterval(interval);
                return;
            }

            retryTimeInMs += 100;
            if (retryTimeInMs >= 600000) {
                reject(new Error('Chat Frame not found.'));
            }
        }, 100);
    });
}

async function init() {
    console.log('init');
    const chatFrameContainer = document.querySelector<HTMLElement>(
        'ytd-page-manager#page-manager',
    );
    if (!chatFrameContainer) {
        console.log('no chat frame container');
        return;
    }

    const chatFrame = await getOrWatchForChatFrameDocument();

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

    const initData = await getInitData(chatFrame.document);

    await youtube.waitForPlayerReady();

    const videoPlayerEle = youtube.getVideoPlayerEle();
    if (!videoPlayerEle) {
        throw new Error('Video Player Ele not found');
    }

    const videoEle = youtube.getVideoEle();
    if (!videoEle) {
        throw new Error('Video Ele not found');
    }

    const store = await createRootStore(
        videoEle,
        videoPlayerEle,
        attachChatEvent,
    );

    const cleanupLiveChat = await injectLiveChatOverlay(
        initData,
        browser,
        store,
    );

    function cleanup(): void {
        store.cleanup();
        cleanupLiveChat();
        window.removeEventListener(
            `${browser.runtime.id}-${CHAT_END_EVENT}`,
            cleanup,
        );
        console.log('cleanup');
    }

    window.addEventListener(`${browser.runtime.id}-${CHAT_END_EVENT}`, cleanup);
}

window.addEventListener(`${browser.runtime.id}-${CHAT_START_EVENT}`, init);
