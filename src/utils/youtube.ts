import type { InitData, YoutubeChatResponse } from '@/definitions/youtube';
import { createError } from '@/logger';

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
        document.querySelector<HTMLElement>(
            '#ytd-player .html5-video-container',
        ) ?? undefined
    );
}

export function getVideoPlayerEle(): HTMLDivElement | undefined {
    return (
        document.querySelector<HTMLDivElement>(
            '#ytd-player .html5-video-player',
        ) ?? undefined
    );
}

export function getRightControlEle(): HTMLElement | undefined {
    return (
        document.querySelector<HTMLElement>(
            '#ytd-player .ytp-right-controls',
        ) ?? undefined
    );
}

export function getVideoEle(): HTMLVideoElement | undefined {
    return (
        document.querySelector<HTMLVideoElement>(
            '#ytd-player .html5-video-player video',
        ) ?? undefined
    );
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
                    reject(createError('Player not found.'));
                }
            }
        }, 100);
    });
}

export function isInitData(
    data: InitData | YoutubeChatResponse,
): data is InitData {
    return (
        'viewerName' in (data.continuationContents?.liveChatContinuation ?? {})
    );
}
