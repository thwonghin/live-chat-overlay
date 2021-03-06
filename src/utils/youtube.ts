import { appendScript, functionToString } from '@/utils';
import type { InitData, YotubeChatResponse } from '@/definitions/youtube';

export const CLASS_BIG_MODE = 'ytp-big-mode';
export const CLASS_PLAYER_CTL_BTN = 'ytp-button';
export const CLASS_POPUP = 'ytp-popup';
export const CLASS_PANEL = 'ytp-panel';
export const CLASS_PANEL_MENU = 'ytp-panel-menu';
export const CLASS_MENUITEM = 'ytp-menuitem';
export const CLASS_AUTOHIDE = 'ytp-autohide';

export const GET_LIVE_CHAT_URL =
    'https://www.youtube.com/youtubei/v1/live_chat/get_live_chat';
export const GET_LIVE_CHAT_REPLAY_URL = `${GET_LIVE_CHAT_URL}_replay`;

export function getVideoPlayerContainer(): HTMLElement | null {
    return window.parent.document.querySelector(
        '#ytd-player .html5-video-container',
    );
}

export function getVideoPlayerEle(): HTMLDivElement | null {
    return window.parent.document.querySelector(
        '#ytd-player .html5-video-player',
    );
}

export function getRightControlEle(): HTMLElement | null {
    return window.parent.document.querySelector(
        '#ytd-player .ytp-right-controls',
    );
}

export function getVideoEle(): HTMLVideoElement | null {
    return window.parent.document.querySelector(
        '#ytd-player .html5-video-player video',
    );
}

export function getLiveChatEle(): HTMLElement | null {
    const ele = document.querySelector('#item-scroller #items');
    return ele as HTMLElement;
}

export function isLiveStream(): boolean {
    return Boolean(getLiveChatEle());
}

export async function waitForPlayerReady(): Promise<void> {
    return new Promise((resolve, reject) => {
        if (getVideoPlayerEle()) {
            resolve();
            return;
        }

        let retryTimeInMs = 0;
        const interval = setInterval(() => {
            if (getVideoPlayerEle()) {
                resolve();
                clearInterval(interval);
            } else {
                retryTimeInMs += 100;
                if (retryTimeInMs >= 600000) {
                    reject(new Error('Player not found.'));
                }
            }
        }, 100);
    });
}

export async function waitForChatReady(): Promise<void> {
    return new Promise((resolve, reject) => {
        if (isLiveStream()) {
            resolve();
            return;
        }

        const isReady = false;

        const observer = new MutationObserver(() => {
            if (isLiveStream()) {
                resolve();
                observer.disconnect();
            }
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
        });

        setTimeout(() => {
            if (!isReady) {
                reject(new Error('Chat not found.'));
                observer.disconnect();
            }
        }, 600000);
    });
}

export function isInsideLiveChatFrame(): boolean {
    return window.location.href.startsWith('https://www.youtube.com/live_chat');
}

function dispatchInitData(prefix: string): void {
    // Window.ytInitialData is mutated, need to get from raw HTML
    const initialDataTag = [...document.querySelectorAll('script')].find(
        (tag) =>
            !tag.innerHTML.includes(prefix) &&
            tag.innerHTML.includes('window["ytInitialData"] ='),
    );

    if (!initialDataTag) {
        return;
    }

    const innerHTML = initialDataTag.innerHTML.trim();
    const startIndex = innerHTML.indexOf('{"responseContext"');
    const initData = innerHTML.slice(startIndex, -1);

    const event = new CustomEvent<{ data: InitData }>(`${prefix}_init_data`, {
        detail: {
            data: JSON.parse(initData) as InitData,
        },
    });

    setTimeout(() => window.dispatchEvent(event), 0);
}

export async function getInitData(prefix: string): Promise<InitData> {
    return new Promise((resolve) => {
        const removeScript = appendScript(
            document,
            functionToString(dispatchInitData, prefix),
        );

        window.addEventListener(`${prefix}_init_data`, (event) => {
            const customEvent = event as CustomEvent<{ data: InitData }>;

            removeScript();
            resolve(customEvent.detail.data);
        });
    });
}

export function isInitData(
    data: InitData | YotubeChatResponse,
): data is InitData {
    return 'viewerName' in data.continuationContents.liveChatContinuation;
}
