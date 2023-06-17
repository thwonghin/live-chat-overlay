import { makeAutoObservable } from 'mobx';

export class PlayerStateModel {
    width = 0;
    height = 0;

    isSeeking = false;
    isPaused = false;

    constructor(
        private readonly videoPlayerEle: HTMLDivElement,
        private readonly videoEle: HTMLVideoElement,
    ) {
        this.assignRect();
        this.assignVideoStates();

        makeAutoObservable(this);
    }

    public assignRect() {
        const { width, height } = this.videoPlayerEle.getBoundingClientRect();
        this.width = width;
        this.height = height;
    }

    public assignVideoStates() {
        this.isSeeking = this.videoEle.seeking;
        this.isPaused = this.videoEle.paused;
    }

    get videoCurrentTimeInSecs() {
        return this.videoEle.currentTime;
    }
}
