import type { PopupType } from './types';
import { createStore } from 'solid-js/store';
import { onCleanup } from 'solid-js';

export type PlayerStateModel = {
    width: number;
    height: number;
    isSeeking: boolean;
    isPaused: boolean;
    readonly videoPlayerEle: HTMLDivElement;
    readonly videoEle: HTMLVideoElement;
    get videoCurrentTimeInSecs(): number;
};

export type UiStoreValue = {
    currentPopup?: PopupType;
    playerState: PlayerStateModel;
};

export type UiStore = Readonly<{
    videoPlayerEle: HTMLDivElement;
    togglePopup: (type: PopupType) => void;
}> &
    UiStoreValue;

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
    const [state, setState] = createStore<UiStoreValue>({
        currentPopup: undefined,
        playerState: {
            width: 0,
            height: 0,
            isSeeking: false,
            isPaused: false,
            videoPlayerEle,
            videoEle,
            get videoCurrentTimeInSecs() {
                return videoEle.currentTime;
            },
        },
    });

    const resizeObserver = new ResizeObserver(() => {
        const { width, height } = videoPlayerEle.getBoundingClientRect();

        setState('playerState', 'width', width);
        setState('playerState', 'height', height);
    });
    resizeObserver.observe(videoPlayerEle);

    function onVideoStateChange() {
        setState('playerState', 'isSeeking', videoEle.seeking);
        setState('playerState', 'isPaused', videoEle.paused);
    }

    VIDEO_EVENTS_TO_SUBSCRIBE.forEach((event) => {
        videoEle.addEventListener(event, onVideoStateChange);
    });

    onCleanup(() => {
        resizeObserver?.disconnect();
        VIDEO_EVENTS_TO_SUBSCRIBE.forEach((event) => {
            videoEle.removeEventListener(event, onVideoStateChange);
        });
    });

    function togglePopup(type: PopupType) {
        const newType = type === state.currentPopup ? undefined : type;
        setState('currentPopup', newType);
    }

    return {
        ...state,
        togglePopup,
        videoPlayerEle,
    };
};
