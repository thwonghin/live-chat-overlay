import { getItemFromEle } from './utils';

import { ChatItem } from './models';

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
        this.isObserving = true;
        this.observer.observe(this.containerEle, observerConfig);

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

    public stop(): void {
        this.isObserving = false;
        this.observer.disconnect();
        clearInterval(this.dequeueInterval);
    }

    public pause(): void {
        this.isObserving = false;
    }

    public resume(): void {
        this.isObserving = true;
    }

    public reset(): void {
        this.queue = [];
    }

    public addEventListener(
        event: ChatEvent,
        callback: ChatEventCallback,
    ): void {
        this.listeners[event] = this.listeners[event].concat(callback);
    }

    public removeEventListener(
        event: ChatEvent,
        callback: ChatEventCallback,
    ): void {
        this.listeners[event] = this.listeners[event].filter(
            (eventListener) => eventListener !== callback,
        );
    }

    public cleanup(): void {
        this.stop();
        this.reset();
        this.listeners.add = [];
    }
}
