import { makeAutoObservable } from 'mobx';

import { PlayerStateModel } from '@/models/ui';

import type { PopupType } from './types';

export class UiStore {
    currentPopup: PopupType | undefined;
    playerState: PlayerStateModel;

    private resizeObserver: ResizeObserver | undefined;

    constructor(private readonly videoPlayerEle: HTMLDivElement) {
        this.playerState = new PlayerStateModel(videoPlayerEle);
        makeAutoObservable(this);
    }

    togglePopup(type: PopupType) {
        if (this.currentPopup === type) {
            this.currentPopup = undefined;
        } else {
            this.currentPopup = type;
        }
    }

    startListening() {
        this.initResizeObserver();
    }

    resetPopup() {
        this.currentPopup = undefined;
    }

    resetPlayerState() {
        this.disconnectResizeObserver();
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
}
