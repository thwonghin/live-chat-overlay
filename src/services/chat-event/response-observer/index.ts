import { CustomEventDetail } from '@/services/xhr-interceptor';
import {
    mapChatItemsFromReplayResponse,
    mapChatItemsFromLiveResponse,
    isTimeToDispatch,
    controlFlow,
    benchmark,
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

interface EventMap {
    add: ChatItem[];
    debug: DebugInfo;
}

const CHAT_EVENT_NAME = `${browser.runtime.id}_chat_message`;

const TIME_DELAY_IN_USEC = 8 * 1000 * 1000;

const MAX_NUM_CHAT_PER_PROCESS = 3;

export type DebugInfo = Partial<{
    processXhrResponseMs: number;
    processChatEventMs: number;
}>;

export class ChatEventResponseObserver {
    private listeners: {
        [Key in keyof EventMap]: ((data: EventMap[Key]) => void)[];
    } = {
        add: [],
        debug: [],
    };

    private isObserving = !document.hidden;

    private isDebugging = false;

    private xhrEventProcessQueue: CustomEventDetail[] = [];

    private xhrEventProcessInterval = -1;

    private chatItemProcessQueue: ChatItem[] = [];

    private chatItemProcessInterval = -1;

    private getCurrentPlayerTime: () => number;

    constructor(getCurrentPlayerTime: () => number) {
        this.getCurrentPlayerTime = getCurrentPlayerTime;
    }

    private onChatMessage = (e: Event): void => {
        const customEvent = e as CustomEvent<CustomEventDetail>;

        if (!customEvent.detail.url.startsWith(GET_LIVE_CHAT_URL)) {
            return;
        }

        this.xhrEventProcessQueue.push(customEvent.detail);
    };

    private handleVisibilityChange = (): void => {
        if (document.hidden) {
            this.pause();
        } else {
            this.resume();
        }
    };

    private processXhrEvent = (): void => {
        const xhrEvent = this.xhrEventProcessQueue.shift();

        if (!xhrEvent) {
            return;
        }

        const { runtime } = benchmark(() => {
            const isReplay = xhrEvent.url.startsWith(GET_LIVE_CHAT_REPLAY_URL);

            const response = JSON.parse(xhrEvent.response) as RootObject;

            const chatItems = isReplay
                ? mapChatItemsFromReplayResponse(response as ReplayRootObject)
                : mapChatItemsFromLiveResponse(response as LiveRootObject);

            this.chatItemProcessQueue.push(...chatItems);
        }, this.isDebugging);

        if (this.isDebugging) {
            this.listeners.debug.forEach((listener) =>
                listener({
                    processXhrResponseMs: runtime,
                }),
            );
        }
    };

    private processChatItem = (): void => {
        const { result, runtime } = benchmark(() => {
            const currentTimeInUsec = Date.now() * 1000;
            const currentPlayerTimeInMsc = this.getCurrentPlayerTime() * 1000;

            let lastIndex = 0;
            for (
                lastIndex = 0;
                lastIndex < this.chatItemProcessQueue.length;
                lastIndex += 1
            ) {
                if (
                    !this.chatItemProcessQueue[lastIndex] ||
                    !isTimeToDispatch({
                        chatItem: this.chatItemProcessQueue[lastIndex],
                        currentTimeInUsec,
                        currentPlayerTimeInMsc,
                        currentTimeDelayInUsec: TIME_DELAY_IN_USEC,
                    })
                ) {
                    break;
                }
            }

            const dispatchingItems = this.chatItemProcessQueue.splice(
                0,
                lastIndex,
            );
            return controlFlow(dispatchingItems, MAX_NUM_CHAT_PER_PROCESS);
        }, this.isDebugging);

        if (this.isDebugging) {
            this.listeners.debug.forEach((listener) =>
                listener({
                    processChatEventMs: runtime,
                }),
            );
        }

        if (result.length > 0 && this.isObserving) {
            this.listeners.add.forEach((listener) => listener(result));
        }
    };

    public start(): void {
        this.isObserving = true;
        window.addEventListener(CHAT_EVENT_NAME, this.onChatMessage);
        document.addEventListener(
            'visibilitychange',
            this.handleVisibilityChange,
        );
        this.xhrEventProcessInterval = window.setInterval(
            this.processXhrEvent,
            500,
        );
        this.chatItemProcessInterval = window.setInterval(
            this.processChatItem,
            100,
        );
    }

    public stop(): void {
        this.isObserving = false;
        window.removeEventListener(CHAT_EVENT_NAME, this.onChatMessage);
        document.removeEventListener(
            'visibilitychange',
            this.handleVisibilityChange,
        );
        window.clearInterval(this.xhrEventProcessInterval);
        window.clearInterval(this.chatItemProcessInterval);
    }

    public pause = (): void => {
        this.isObserving = false;
    };

    public resume = (): void => {
        this.isObserving = true;
    };

    public reset(): void {
        this.chatItemProcessQueue = [];
        this.xhrEventProcessQueue = [];
    }

    public startDebug(): void {
        this.isDebugging = true;
    }

    public stopDebug(): void {
        this.isDebugging = false;
    }

    public addEventListener<K extends keyof EventMap>(
        event: K,
        callback: (data: EventMap[K]) => void,
    ): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.listeners[event].push(callback as any);
    }

    public removeEventListener<K extends keyof EventMap>(
        event: K,
        callback: (data: EventMap[K]) => void,
    ): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const found = this.listeners[event].indexOf(callback as any);
        this.listeners[event].splice(found, 1);
    }

    public cleanup(): void {
        this.stop();
        this.reset();
        this.listeners.add = [];
    }
}
