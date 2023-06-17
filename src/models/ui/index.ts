import { makeAutoObservable, runInAction } from 'mobx';

export class PlayerStateModel {
    width = 0;
    height = 0;

    constructor(private readonly videoPlayerEle: HTMLDivElement) {
        this.assignRect();

        makeAutoObservable(this);
    }

    public assignRect() {
        const { width, height } = this.videoPlayerEle.getBoundingClientRect();
        runInAction(() => {
            this.width = width;
            this.height = height;
        });
    }
}
