import { CustomEventDetail } from '@/services/xhr-interceptor';
import type {
    RootObject,
    ReplayRootObject,
    LiveRootObject,
    InitData,
} from '@/definitions/youtube';
import {
    mapChatItemsFromReplayResponse,
    mapChatItemsFromLiveResponse,
    isTimeToDispatch,
    isOutdatedLiveChatItem,
    isOutdatedReplayChatItem,
    isRemovable,
    benchmark,
    isReplayInitData,
} from './helpers';
import type { ChatItem } from '../models';

const GET_LIVE_CHAT_URL = 'https://www.youtube.com/live_chat';
const GET_LIVE_CHAT_REPLAY_URL =
    'https://www.youtube.com/live_chat_replay/get_live_chat_replay';

interface EventMap {
    debug: DebugInfo;
}

const CHAT_EVENT_NAME = `${browser.runtime.id}_chat_message`;

export type DebugInfo = Partial<{
    processXhrResponseMs: number;
    processChatEventMs: number;
    processXhrQueueLength: number;
    processChatEventQueueLength: number;
    outdatedChatEventCount: number;
}>;

export class ChatEventResponseObserver {
    private listeners: {
        [Key in keyof EventMap]: ((data: EventMap[Key]) => void)[];
    } = {
        debug: [],
    };

    private isStarted = false;

    private isDebugging = false;

    private xhrEventProcessQueue: {
        responseText: string;
        isReplay: boolean;
    }[] = [];

    private xhrEventProcessInterval = -1;

    private chatItemProcessQueue: ChatItem[] = [];

    public importInitData(initData: InitData): void {
        const chatItems = isReplayInitData(initData)
            ? mapChatItemsFromReplayResponse(initData.continuationContents)
            : mapChatItemsFromLiveResponse(initData.continuationContents);

        this.chatItemProcessQueue.push(...chatItems);

        this.emitDebugInfoEvent({
            processChatEventQueueLength: this.chatItemProcessQueue.length,
        });
    }

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

        const isReplay = customEvent.detail.url.startsWith(
            GET_LIVE_CHAT_REPLAY_URL,
        );
        this.xhrEventProcessQueue.push({
            isReplay,
            responseText: customEvent.detail.response,
        });
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
            const response = JSON.parse(xhrEvent.responseText) as RootObject;

            const chatItems = xhrEvent.isReplay
                ? mapChatItemsFromReplayResponse(
                      (response as ReplayRootObject).response
                          .continuationContents,
                  )
                : mapChatItemsFromLiveResponse(
                      (response as LiveRootObject).response
                          .continuationContents,
                  );

            this.chatItemProcessQueue.push(...chatItems);
        }, this.isDebugging);

        this.emitDebugInfoEvent({
            processXhrResponseMs: runtime,
            processXhrQueueLength: this.xhrEventProcessQueue.length,
            processChatEventQueueLength: this.chatItemProcessQueue.length,
        });
    };

    private cleanOutdatedChatItems(params: {
        currentTimeInUsec: number;
        currentPlayerTimeInMsc: number;
        chatDisplayTimeInMs: number;
    }): void {
        let count = 0;

        this.chatItemProcessQueue = this.chatItemProcessQueue.filter(
            (chatItem) => {
                const isOutdatedChatItem = chatItem.videoTimestampInMs
                    ? isOutdatedReplayChatItem({
                          currentPlayerTimeInMsc: params.currentPlayerTimeInMsc,
                          chatItemAtVideoTimestampInMs:
                              chatItem.videoTimestampInMs,
                      })
                    : isOutdatedLiveChatItem({
                          currentTimeInUsec: params.currentTimeInUsec,
                          liveDelayInMs: chatItem.liveDelayInMs,
                          chatItemCreateAtTimestampInUs: chatItem.timestampInUs,
                      });

                const isRemovableChatItem = isRemovable(chatItem);

                if (isOutdatedChatItem && isRemovableChatItem) {
                    count += 1;
                }
                return !(isOutdatedChatItem && isRemovableChatItem);
            },
        );

        this.emitDebugInfoEvent({
            outdatedChatEventCount: count,
        });
    }

    public dequeueChatItem(params: {
        currentPlayerTimeInMsc: number;
        chatDisplayTimeInMs: number;
    }): ChatItem | undefined {
        const currentTimeInUsec = Date.now() * 1000;
        this.cleanOutdatedChatItems({
            ...params,
            currentTimeInUsec,
        });

        if (!this.chatItemProcessQueue[0]) {
            return undefined;
        }

        const { result: isTime, runtime } = benchmark(() => {
            return isTimeToDispatch({
                chatItem: this.chatItemProcessQueue[0],
                currentTimeInUsec,
                currentPlayerTimeInMsc: params.currentPlayerTimeInMsc,
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
}
