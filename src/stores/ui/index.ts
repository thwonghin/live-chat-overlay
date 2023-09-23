import { noop } from 'lodash-es';
import { type Accessor, createRoot, onCleanup, onMount } from 'solid-js';
import { type SetStoreFunction, createStore } from 'solid-js/store';

import { FontScaleMethod } from '@/models/settings';
import { assertNever } from '@/utils';

import type { PopupType } from './types';
import { type SettingsStore } from '../settings';

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

const VIDEO_EVENTS_TO_SUBSCRIBE: Array<keyof HTMLVideoElementEventMap> = [
    'seeking',
    'pause',
    'play',
    'playing',
    'seeked',
];

export class UiStore {
    state: UiStoreState;
    cleanup = noop;

    private readonly setState: SetStoreFunction<UiStoreState>;

    constructor(
        public videoPlayerEle: HTMLDivElement,
        private readonly videoEle: HTMLVideoElement,
        private readonly settingsStore: SettingsStore,
    ) {
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

        // eslint-disable-next-line solid/reactivity
        this.state = state;
        this.setState = setState;
    }

    lineHeight() {
        const playerHeight = this.state.playerState.height;
        const { fontScaleMethod } = this.settingsStore.settings;
        switch (fontScaleMethod) {
            case FontScaleMethod.FIXED:
                return this.settingsStore.settings.fontSizeFixed;
            case FontScaleMethod.SCALED:
                return (
                    (playerHeight *
                        this.settingsStore.settings.fontSizeScaled) /
                    100
                );
            default:
                return assertNever(fontScaleMethod);
        }
    }

    maxNumberOfLines() {
        return Math.min(
            this.state.playerState.height / this.lineHeight(),
            this.settingsStore.settings.totalNumberOfLines,
        );
    }

    init() {
        this.attachReactiveContext();
    }

    togglePopup(type: PopupType) {
        this.setState('currentPopup', (s) => (type === s ? undefined : type));
    }

    private readonly handleVideoStateChange = () => {
        this.setState('playerState', 'isPaused', this.videoEle.paused);
    };

    private readonly handleResize = () => {
        const { width, height } = this.videoPlayerEle.getBoundingClientRect();

        this.setState('playerState', {
            width,
            height,
        });
    };

    private attachReactiveContext() {
        createRoot((dispose) => {
            onMount(() => {
                const resizeObserver = new ResizeObserver(this.handleResize);
                resizeObserver.observe(this.videoPlayerEle);

                onCleanup(() => {
                    resizeObserver.disconnect();
                });
            });

            onMount(() => {
                VIDEO_EVENTS_TO_SUBSCRIBE.forEach((event) => {
                    this.videoEle.addEventListener(
                        event,
                        this.handleVideoStateChange,
                    );
                });

                onCleanup(() => {
                    VIDEO_EVENTS_TO_SUBSCRIBE.forEach((event) => {
                        this.videoEle.removeEventListener(
                            event,
                            this.handleVideoStateChange,
                        );
                    });
                });
            });

            this.cleanup = dispose;
        });
    }
}
