import { appendScript, functionToString } from '@/utils';
import type { InitData } from '@/definitions/youtube';

export function getVideoPlayerContainer(): HTMLElement | null {
    return window.parent.document.querySelector(
        '#ytd-player .html5-video-container',
    );
}

export function getVideoPlayerEle(): HTMLElement | null {
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
    return !!getLiveChatEle();
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

export function injectStyles(): void {
    const path = browser.extension.getURL('content-script.css');

    if (window.parent.document.querySelector(`link[href="${path}"]`)) {
        return;
    }

    const link = window.parent.document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = path;

    window.parent.document.head.appendChild(link);
}

export function isInsideLiveChatFrame(): boolean {
    return window.location.href.startsWith('https://www.youtube.com/live_chat');
}

function dispatchInitData(extensionId: string): void {
    const event = new CustomEvent<{ data: InitData }>(
        `${extensionId}_init_data`,
        {
            detail: {
                data: window.ytInitialData as InitData,
            },
        },
    );

    setTimeout(() => window.dispatchEvent(event), 0);
}

export async function getInitData(): Promise<InitData> {
    const extensionId = browser.runtime.id;

    return new Promise((resolve) => {
        const removeScript = appendScript(
            document,
            functionToString(dispatchInitData, browser.runtime.id),
        );

        window.addEventListener(`${extensionId}_init_data`, (event) => {
            const customEvent = event as CustomEvent<{ data: InitData }>;

            removeScript();
            resolve(customEvent.detail.data);
        });
    });
}
