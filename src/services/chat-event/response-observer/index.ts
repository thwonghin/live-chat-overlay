import { CustomEventDetail } from '@/services/xhr-interceptor';
import {
    mapChatItemsFromReplayResponse,
    mapChatItemsFromLiveResponse,
    isTimeToDispatch,
} from './helpers';
import { ChatItem } from '../models';
import {
    RootObject,
    ReplayRootObject,
    LiveRootObject,
} from '../live-chat-response';

const GET_LIVE_CHAT_URL = 'https://www.youtube.com/live_chat';
const GET_LIVE_CHAT_REPLAY_URL =
    'https://www.youtube.com/live_chat_replay/get_live_chat_replay';

type ChatEvent = 'add';

type ChatEventCallback = (chatItem: ChatItem) => void;

const CHAT_EVENT_NAME = `${browser.runtime.id}_chat_message`;

const TIME_DELAY_IN_USEC = 8 * 1000 * 1000;

export class ChatEventResponseObserver {
    private listeners: Record<ChatEvent, ChatEventCallback[]> = {
        add: [],
    };

    private isObserving = false;

    private queue: ChatItem[] = [];

    private dequeueTimeout = -1;

    private getCurrentPlayerTime: () => number;

    constructor(getCurrentPlayerTime: () => number) {
        this.getCurrentPlayerTime = getCurrentPlayerTime;
    }

    private onChatMessage = (e: Event): void => {
        if (!this.isObserving) {
            return;
        }
        const customEvent = e as CustomEvent<CustomEventDetail>;

        if (!customEvent.detail.url.startsWith(GET_LIVE_CHAT_URL)) {
            return;
        }

        const isReplay = customEvent.detail.url.startsWith(
            GET_LIVE_CHAT_REPLAY_URL,
        );

        const response = JSON.parse(customEvent.detail.response) as RootObject;

        const chatItems = isReplay
            ? mapChatItemsFromReplayResponse(response as ReplayRootObject)
            : mapChatItemsFromLiveResponse(response as LiveRootObject);

        this.queue.push(...chatItems);
    };

    private handleQueue = (): void => {
        const currentTimeInUsec = Date.now() * 1000;
        const currentPlayerTimeInMsc = this.getCurrentPlayerTime() * 1000;

        this.queue = this.queue.filter((chatItem) => {
            const shouldDispatch = isTimeToDispatch({
                chatItem,
                currentTimeInUsec,
                currentPlayerTimeInMsc,
                currentTimeDelayInUsec: TIME_DELAY_IN_USEC,
            });

            if (shouldDispatch) {
                this.listeners.add.forEach((listener) => listener(chatItem));
            }

            return !shouldDispatch;
        });

        this.dequeueTimeout = window.setTimeout(this.handleQueue, 100);
    };

    public start(): void {
        window.addEventListener(CHAT_EVENT_NAME, this.onChatMessage);
        this.handleQueue();
    }

    public stop(): void {
        this.isObserving = false;
        window.removeEventListener(CHAT_EVENT_NAME, this.onChatMessage);
        clearTimeout(this.dequeueTimeout);
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
