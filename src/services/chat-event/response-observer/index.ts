import { CustomEventDetail } from '@/services/xhr-interceptor';
import {
    mapChatItemsFromReplayResponse,
    mapChatItemsFromLiveResponse,
    isTimeToDispatch,
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
    debug: DebugInfo;
}

const CHAT_EVENT_NAME = `${browser.runtime.id}_chat_message`;

const TIME_DELAY_IN_USEC = 8 * 1000 * 1000;

export type DebugInfo = Partial<{
    processXhrResponseMs: number;
    processChatEventMs: number;
    processXhrQueueLength: number;
    processChatEventQueueLength: number;
}>;

export class ChatEventResponseObserver {
    private listeners: {
        [Key in keyof EventMap]: ((data: EventMap[Key]) => void)[];
    } = {
        debug: [],
    };

    private isStarted = false;

    private isDebugging = false;

    private xhrEventProcessQueue: CustomEventDetail[] = [];

    private xhrEventProcessInterval = -1;

    private chatItemProcessQueue: ChatItem[] = [];

    private chatItemProcessInterval = -1;

    private emitDebugInfoEvent(debugInfo: DebugInfo) {
        if (this.isDebugging) {
            this.listeners.debug.forEach((listener) => listener(debugInfo));
        }
    }

    private onChatMessage = (e: Event): void => {
        const customEvent = e as CustomEvent<CustomEventDetail>;

        if (!customEvent.detail.url.startsWith(GET_LIVE_CHAT_URL)) {
            return;
        }

        this.xhrEventProcessQueue.push(customEvent.detail);
        this.emitDebugInfoEvent({
            processXhrQueueLength: this.xhrEventProcessQueue.length,
        });
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

        this.emitDebugInfoEvent({
            processXhrResponseMs: runtime,
            processXhrQueueLength: this.xhrEventProcessQueue.length,
            processChatEventQueueLength: this.chatItemProcessQueue.length,
        });
    };

    public dequeueChatItem(
        currentPlayerTimeInMsc: number,
    ): ChatItem | undefined {
        if (!this.chatItemProcessQueue[0]) {
            return undefined;
        }

        const currentTimeInUsec = Date.now() * 1000;
        const { result: isTime, runtime } = benchmark(() => {
            return isTimeToDispatch({
                chatItem: this.chatItemProcessQueue[0],
                currentTimeInUsec,
                currentPlayerTimeInMsc,
                currentTimeDelayInUsec: TIME_DELAY_IN_USEC,
            });
        }, this.isDebugging);

        if (!isTime) {
            this.emitDebugInfoEvent({
                processChatEventMs: runtime,
                processChatEventQueueLength: this.chatItemProcessQueue.length,
            });
            return undefined;
        }

        const chatItem = this.chatItemProcessQueue.shift();
        this.emitDebugInfoEvent({
            processChatEventMs: runtime,
            processChatEventQueueLength: this.chatItemProcessQueue.length,
        });

        return chatItem;
    }

    public start(): void {
        if (this.isStarted) {
            return;
        }
        this.isStarted = true;
        window.addEventListener(CHAT_EVENT_NAME, this.onChatMessage);
        this.xhrEventProcessInterval = window.setInterval(
            this.processXhrEvent,
            500,
        );
    }

    public stop(): void {
        if (!this.isStarted) {
            return;
        }
        this.isStarted = false;
        window.removeEventListener(CHAT_EVENT_NAME, this.onChatMessage);
        window.clearInterval(this.xhrEventProcessInterval);
        window.clearInterval(this.chatItemProcessInterval);
    }

    public reset(): void {
        this.chatItemProcessQueue = [];
        this.xhrEventProcessQueue = [];

        this.emitDebugInfoEvent({
            processXhrQueueLength: 0,
            processChatEventQueueLength: 0,
        });
    }

    public startDebug(): void {
        this.isDebugging = true;
        this.emitDebugInfoEvent({
            processXhrQueueLength: this.xhrEventProcessQueue.length,
            processChatEventQueueLength: this.chatItemProcessQueue.length,
        });
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
        this.listeners.debug = [];
    }
}
