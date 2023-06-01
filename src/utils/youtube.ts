import type { InitData, YotubeChatResponse } from '@/definitions/youtube';
import { injectScript } from '@/utils';

import { LIVE_CHAT_INIT_DATA } from '../constants';

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

export function getVideoPlayerContainer(): HTMLElement | undefined {
    return (
        window.parent.document.querySelector<HTMLElement>(
            '#ytd-player .html5-video-container',
        ) ?? undefined
    );
}

export function getVideoPlayerEle(): HTMLDivElement | undefined {
    return (
        window.parent.document.querySelector<HTMLDivElement>(
            '#ytd-player .html5-video-player',
        ) ?? undefined
    );
}

export function getRightControlEle(): HTMLElement | undefined {
    return (
        window.parent.document.querySelector<HTMLElement>(
            '#ytd-player .ytp-right-controls',
        ) ?? undefined
    );
}

export function getVideoEle(): HTMLVideoElement | undefined {
    return (
        window.parent.document.querySelector<HTMLVideoElement>(
            '#ytd-player .html5-video-player video',
        ) ?? undefined
    );
}

export function getLiveChatEle(): HTMLElement | undefined {
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

export async function getInitData(scriptSrc: string): Promise<InitData> {
    return new Promise((resolve) => {
        window.addEventListener(LIVE_CHAT_INIT_DATA, (event) => {
            const customEvent = event as CustomEvent<{ data: InitData }>;

            resolve(customEvent.detail.data);
        });
        injectScript(scriptSrc);
    });
}

export function isInitData(
    data: InitData | YotubeChatResponse,
): data is InitData {
    return 'viewerName' in data.continuationContents.liveChatContinuation;
}
