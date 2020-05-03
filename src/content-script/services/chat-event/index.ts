import { getItemFromEle } from './utils';

import { ChatItem } from './models.d';

type ChatEvent = 'add';

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
    };

    private isObserving = false;

    private queue: HTMLElement[] = [];

    private dequeueInterval = -1;

    constructor(params: InitChatEventObserverParams) {
        this.containerEle = params.containerEle;

        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (!this.isObserving) {
                    return;
                }

                mutation.addedNodes.forEach((node) => {
                    if (!(node instanceof HTMLElement)) {
                        return;
                    }
                    this.queue.push(node);
                });
            });
        });
    }

    public start(): void {
        this.dequeueInterval = window.setInterval(() => {
            const element = this.queue.shift();
            if (!element) {
                return;
            }

            const chatItem = getItemFromEle(element);
            if (!chatItem) {
                return;
            }
            this.listeners.add.forEach((listener) => listener(chatItem));
        }, 100);
    }

    private get listenerCount(): number {
        return this.listeners.add.length;
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
        this.handleObserverStatus();
        clearInterval(this.dequeueInterval);
    }
}
