import { getItemFromNode } from './utils';

import { ChatItem } from './models';

type ChatEvent = 'add' | 'remove';

type ChatEventCallback = (chatItem: ChatItem) => void;

interface InitChatEventObserverParams {
    containerEle: HTMLElement;
}

const observerConfig: MutationObserverInit = {
    childList: true,
};

export class ChatEventObserver {
    private containerEle: HTMLElement;

    private observer: MutationObserver;

    private listeners: Record<ChatEvent, ChatEventCallback[]> = {
        add: [],
        remove: [],
    };

    private isObserving = false;

    constructor(params: InitChatEventObserverParams) {
        this.containerEle = params.containerEle;

        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) =>
                    this.listeners.add.forEach((listener) =>
                        listener(getItemFromNode(node)),
                    ),
                );

                mutation.removedNodes.forEach((node) =>
                    this.listeners.remove.forEach((listener) =>
                        listener(getItemFromNode(node)),
                    ),
                );
            });
        });
    }

    private get listenerCount(): number {
        return this.listeners.add.length + this.listeners.remove.length;
    }

    private handleObserverStatus(): void {
        if (this.isObserving && this.listenerCount === 0) {
            this.observer.disconnect();
            this.isObserving = false;
        } else if (!this.isObserving && this.listenerCount > 0) {
            this.observer.observe(this.containerEle, observerConfig);
            this.isObserving = true;
        }
    }

    public addEventListener(
        event: ChatEvent,
        callback: ChatEventCallback,
    ): void {
        this.listeners[event] = this.listeners[event].concat(callback);
        this.handleObserverStatus();
    }

    public removeEventListener(
        event: ChatEvent,
        callback: ChatEventCallback,
    ): void {
        this.listeners[event] = this.listeners[event].filter(
            (eventListener) => eventListener !== callback,
        );
        this.handleObserverStatus();
    }

    public cleanup(): void {
        this.listeners.add = [];
        this.listeners.remove = [];
        this.handleObserverStatus();
    }
}
