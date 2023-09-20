import { createRoot, onCleanup, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';

import type { PopupType } from './types';

export type PlayerStateModel = {
    width: number;
    height: number;
    isPaused: boolean;
    readonly videoPlayerEle: HTMLDivElement;
    readonly videoEle: HTMLVideoElement;
    get videoCurrentTimeInSecs(): number;
};

export type UiStoreState = {
    currentPopup?: PopupType;
    playerState: PlayerStateModel;
};

export type UiStore = Readonly<{
    state: UiStoreState;
    videoPlayerEle: HTMLDivElement;
    togglePopup: (type: PopupType) => void;
    cleanup?: () => void;
}>;

const VIDEO_EVENTS_TO_SUBSCRIBE: Array<keyof HTMLVideoElementEventMap> = [
    'seeking',
    'pause',
    'play',
    'playing',
    'seeked',
];

export const createUiStore = (
    videoPlayerEle: HTMLDivElement,
    videoEle: HTMLVideoElement,
): UiStore => {
    const [state, setState] = createStore<UiStoreState>({
        currentPopup: undefined,
        playerState: {
            width: 0,
            height: 0,
            isPaused: false,
            videoPlayerEle,
            videoEle,
            get videoCurrentTimeInSecs() {
                return videoEle.currentTime;
            },
        },
    });

    function togglePopup(type: PopupType) {
        setState('currentPopup', (s) => (type === s ? undefined : type));
    }

    let cleanup: (() => void) | undefined;

    createRoot((dispose) => {
        onMount(() => {
            const resizeObserver = new ResizeObserver(() => {
                const { width, height } =
                    videoPlayerEle.getBoundingClientRect();

                setState('playerState', {
                    width,
                    height,
                });
            });

            resizeObserver.observe(videoPlayerEle);

            onCleanup(() => {
                resizeObserver.disconnect();
            });
        });

        onMount(() => {
            function onVideoStateChange() {
                setState('playerState', 'isPaused', videoEle.paused);
            }

            VIDEO_EVENTS_TO_SUBSCRIBE.forEach((event) => {
                videoEle.addEventListener(event, onVideoStateChange);
            });

            onCleanup(() => {
                VIDEO_EVENTS_TO_SUBSCRIBE.forEach((event) => {
                    videoEle.removeEventListener(event, onVideoStateChange);
                });
            });
        });

        cleanup = dispose;
    });

    return {
        state,
        cleanup,
        togglePopup,
        videoPlayerEle,
    };
};
