import { makeAutoObservable } from 'mobx';

import { PlayerStateModel } from '@/models/ui';

import type { PopupType } from './types';

export class UiStore {
    currentPopup: PopupType | undefined;
    playerState: PlayerStateModel;

    private resizeObserver: ResizeObserver | undefined;

    constructor(
        public readonly videoPlayerEle: HTMLDivElement,
        private readonly videoEle: HTMLVideoElement,
    ) {
        this.playerState = new PlayerStateModel(videoPlayerEle, videoEle);
        makeAutoObservable(this);
    }

    togglePopup(type: PopupType) {
        if (this.currentPopup === type) {
            this.currentPopup = undefined;
        } else {
            this.currentPopup = type;
        }
    }

    init() {
        this.initResizeObserver();
        this.addVideoStateChangeListener();
    }

    cleanup() {
        this.currentPopup = undefined;
        this.disconnectResizeObserver();
        this.removeVideoStateChangeListener();
    }

    private initResizeObserver() {
        this.resizeObserver = new ResizeObserver(() => {
            this.playerState.assignRect();
        });
        this.resizeObserver.observe(this.videoPlayerEle);
    }

    private disconnectResizeObserver() {
        if (!this.resizeObserver) {
            return;
        }

        this.resizeObserver.disconnect();
        this.resizeObserver = undefined;
    }

    private addVideoStateChangeListener() {
        this.videoEle.addEventListener('seeking', this.onVideoStateChange);
        this.videoEle.addEventListener('pause', this.onVideoStateChange);
        this.videoEle.addEventListener('play', this.onVideoStateChange);
        this.videoEle.addEventListener('playing', this.onVideoStateChange);
        this.videoEle.addEventListener('seeked', this.onVideoStateChange);
    }

    private removeVideoStateChangeListener() {
        this.videoEle.removeEventListener('seeking', this.onVideoStateChange);
        this.videoEle.removeEventListener('pause', this.onVideoStateChange);
        this.videoEle.removeEventListener('play', this.onVideoStateChange);
        this.videoEle.removeEventListener('playing', this.onVideoStateChange);
        this.videoEle.removeEventListener('seeked', this.onVideoStateChange);
    }

    private readonly onVideoStateChange = () => {
        this.playerState.assignVideoStates();
    };
}
