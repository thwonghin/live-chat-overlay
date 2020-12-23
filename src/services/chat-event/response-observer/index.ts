import type { fetchInterceptor } from '@/services';
import type {
    YotubeChatResponse,
    ReplayResponse,
    LiveResponse,
    InitData,
} from '@/definitions/youtube';
import { benchmark, EventEmitter } from '@/utils';
import { GET_LIVE_CHAT_REPLAY_URL } from '@/utils/youtube';

import {
    mapChatItemsFromReplayResponse,
    mapChatItemsFromLiveResponse,
    isTimeToDispatch,
    isOutdatedLiveChatItem,
    isOutdatedReplayChatItem,
    getOutdatedFactor,
    isReplayInitData,
} from './helpers';
import type { ChatItem } from '../models';

export type DebugInfo = Partial<{
    processXhrResponseMs: number;
    processChatEventMs: number;
    processChatEventQueueLength: number;
    outdatedChatEventCount: number;
}>;

type EventMap = {
    debug: DebugInfo;
};

type ResponseObserverEventEmitter = EventEmitter<EventMap>;

export class ResponseObserver {
    private eventEmitter: ResponseObserverEventEmitter;

    private isStarted = false;

    private isDebugging = false;

    private chatItemProcessQueue: ChatItem[] = [];

    constructor(readonly chatEventName: string) {
        this.eventEmitter = new EventEmitter();
    }

    public on: ResponseObserverEventEmitter['on'] = (...args) =>
        this.eventEmitter.on(...args);

    public off: ResponseObserverEventEmitter['off'] = (...args) =>
        this.eventEmitter.off(...args);

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
            this.eventEmitter.trigger('debug', debugInfo);
        }
    }

    private onChatMessage = (e: Event): void => {
        const customEvent = e as CustomEvent<fetchInterceptor.CustomEventDetail>;

        const isReplay = customEvent.detail.url.startsWith(
            GET_LIVE_CHAT_REPLAY_URL,
        );

        const response = customEvent.detail.response as YotubeChatResponse;

        const { runtime } = benchmark(() => {
            const chatItems = isReplay
                ? mapChatItemsFromReplayResponse(
                      (response as ReplayResponse).continuationContents,
                  )
                : mapChatItemsFromLiveResponse(
                      (response as LiveResponse).continuationContents,
                  );

            this.chatItemProcessQueue.push(...chatItems);
        }, this.isDebugging);

        this.emitDebugInfoEvent({
            processXhrResponseMs: runtime,
            processChatEventQueueLength: this.chatItemProcessQueue.length,
        });
    };

    private cleanOutdatedChatItems(params: {
        currentTimeInUsec: number;
        currentPlayerTimeInMsc: number;
    }): void {
        let count = 0;

        this.chatItemProcessQueue = this.chatItemProcessQueue.filter(
            (chatItem) => {
                const factor = getOutdatedFactor(chatItem);
                const isOutdatedChatItem = chatItem.videoTimestampInMs
                    ? isOutdatedReplayChatItem({
                          factor,
                          currentPlayerTimeInMsc: params.currentPlayerTimeInMsc,
                          chatItemAtVideoTimestampInMs:
                              chatItem.videoTimestampInMs,
                      })
                    : isOutdatedLiveChatItem({
                          factor,
                          currentTimeInUsec: params.currentTimeInUsec,
                          liveDelayInMs: chatItem.liveDelayInMs,
                          chatItemCreateAtTimestampInUs: chatItem.timestampInUs,
                      });

                if (isOutdatedChatItem) {
                    count += 1;
                }
                return !isOutdatedChatItem;
            },
        );

        this.emitDebugInfoEvent({
            outdatedChatEventCount: count,
        });
    }

    public dequeueChatItem(
        currentPlayerTimeInMsc: number,
    ): ChatItem | undefined {
        const currentTimeInUsec = Date.now() * 1000;
        this.cleanOutdatedChatItems({
            currentPlayerTimeInMsc,
            currentTimeInUsec,
        });

        if (!this.chatItemProcessQueue[0]) {
            return undefined;
        }

        const { result: isTime, runtime } = benchmark(() => {
            if (!this.chatItemProcessQueue[0]) {
                throw new Error('Unknown error');
            }
            return isTimeToDispatch({
                chatItem: this.chatItemProcessQueue[0],
                currentTimeInUsec,
                currentPlayerTimeInMsc,
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
        window.addEventListener(this.chatEventName, this.onChatMessage);
    }

    public stop(): void {
        if (!this.isStarted) {
            return;
        }
        this.isStarted = false;
        window.removeEventListener(this.chatEventName, this.onChatMessage);
    }

    public reset(): void {
        this.chatItemProcessQueue = [];

        this.emitDebugInfoEvent({
            processChatEventQueueLength: 0,
        });
    }

    public startDebug(): void {
        this.isDebugging = true;
        this.emitDebugInfoEvent({
            processChatEventQueueLength: this.chatItemProcessQueue.length,
        });
    }

    public stopDebug(): void {
        this.isDebugging = false;
    }
}
