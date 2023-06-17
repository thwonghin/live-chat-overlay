import { makeAutoObservable } from 'mobx';

import type { PopupType } from './types';

export class UiStore {
    currentPopup: PopupType | undefined;

    constructor() {
        makeAutoObservable(this);
    }

    togglePopup(type: PopupType) {
        if (this.currentPopup === type) {
            this.currentPopup = undefined;
        } else {
            this.currentPopup = type;
        }
    }

    reset() {
        this.currentPopup = undefined;
    }
}
