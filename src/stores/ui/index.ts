import { noop } from 'lodash-es';
import { createRoot, onCleanup, onMount } from 'solid-js';
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

    messageFlowDimensionPx(): {
        top: number;
        bottom: number;
        left: number;
        right: number;
        width: number;
        height: number;
    } {
        const { messagePosition } = this.settingsStore.settings;
        const { mode, top, left, bottom, right } = messagePosition;

        switch (mode) {
            case 'fixed': {
                const clampedBottom = Math.min(
                    bottom,
                    this.state.playerState.height,
                );
                const clampedRight = Math.min(
                    right,
                    this.state.playerState.width,
                );
                return {
                    top,
                    left,
                    bottom: clampedBottom,
                    right: clampedRight,
                    height: clampedBottom - top,
                    width: clampedRight - left,
                };
            }

            case 'ratio': {
                const fixedTop = (this.state.playerState.height * top) / 100;
                const fixedBottom =
                    (this.state.playerState.height * bottom) / 100;
                const fixedLeft = (this.state.playerState.width * left) / 100;
                const fixedRight = (this.state.playerState.width * right) / 100;

                return {
                    top: fixedTop,
                    bottom: fixedBottom,
                    left: fixedLeft,
                    right: fixedRight,
                    height: fixedBottom - fixedTop,
                    width: fixedRight - fixedLeft,
                };
            }

            default:
                return assertNever(mode);
        }
    }

    maxNumberOfLines() {
        const messageFlowDimensionPx = this.messageFlowDimensionPx();

        return Math.min(
            messageFlowDimensionPx.height / this.lineHeight(),
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
