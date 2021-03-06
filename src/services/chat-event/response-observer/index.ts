import type { fetchInterceptor } from '@/services';
import type {
    YotubeChatResponse,
    ReplayResponse,
    LiveResponse,
    InitData,
} from '@/definitions/youtube';
import { benchmark, benchmarkAsync, EventEmitter, youtube } from '@/utils';
import { settingsStorage } from '@/services';

import {
    mapChatItemsFromReplayResponse,
    mapChatItemsFromLiveResponse,
    isTimeToDispatch,
    isOutdatedChatItem,
    getOutdatedFactor,
    isReplayInitData,
} from './helpers';
import { assignChatItemRenderedWidth } from './get-chat-item-render-container-ele';
import type { ChatItem } from '../models';

export { CHAT_ITEM_RENDER_ID } from './get-chat-item-render-container-ele';

export type DebugInfo = Partial<{
    processXhrResponseMs: number;
    processChatEventMs: number;
    processChatEventQueueLength: number;
    outdatedChatEventCount: number;
    getEleWidthBenchmark: number;
}>;

type EventMap = {
    debug: DebugInfo;
};

type ResponseObserverEventEmitter = EventEmitter<EventMap>;

export class ResponseObserver {
    private readonly eventEmitter: ResponseObserverEventEmitter;

    private isStarted = false;

    private isDebugging = false;

    private chatItemProcessQueue: ChatItem[] = [];

    constructor(
        readonly chatEventName: string,
        private readonly videoPlayer: HTMLVideoElement,
    ) {
        this.eventEmitter = new EventEmitter();
    }

    public on: ResponseObserverEventEmitter['on'] = (...args) => {
        this.eventEmitter.on(...args);
    };

    public off: ResponseObserverEventEmitter['off'] = (...args) => {
        this.eventEmitter.off(...args);
    };

    public async importInitData(initData: InitData): Promise<void> {
        await this.processChatItems(initData, isReplayInitData(initData));
    }

    public dequeueChatItem(): ChatItem | undefined {
        const currentPlayerTimeInMsc =
            (this.videoPlayer.currentTime ?? 0) * 1000;

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

            return (
                this.chatItemProcessQueue[0].chatType === 'pinned' ||
                isTimeToDispatch({
                    chatItem: this.chatItemProcessQueue[0],
                    currentPlayerTimeInMsc,
                })
            );
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

    private getCurrentTimeInfo(): {
        playerTimestampMs: number;
        currentTimestampMs: number;
    } {
        return {
            playerTimestampMs: this.videoPlayer.currentTime * 1000,
            currentTimestampMs: Date.now(),
        };
    }

    private emitDebugInfoEvent(debugInfo: DebugInfo) {
        if (this.isDebugging) {
            this.eventEmitter.trigger('debug', debugInfo);
        }
    }

    private readonly onChatMessage = async (event: Event): Promise<void> => {
        const customEvent = event as CustomEvent<fetchInterceptor.CustomEventDetail>;

        const isReplay = customEvent.detail.url.startsWith(
            youtube.GET_LIVE_CHAT_REPLAY_URL,
        );

        const response = customEvent.detail.response as
            | YotubeChatResponse
            | InitData;

        await this.processChatItems(response, isReplay);
    };

    private async processChatItems(
        response: YotubeChatResponse | InitData,
        isReplay: boolean,
    ): Promise<void> {
        if (youtube.isInitData(response)) {
            this.reset();
        }

        const { runtime } = await benchmarkAsync(async () => {
            const timeInfo = this.getCurrentTimeInfo();
            const chatItems = isReplay
                ? mapChatItemsFromReplayResponse({
                      ...timeInfo,
                      continuationContents: (response as ReplayResponse)
                          .continuationContents,
                  })
                : mapChatItemsFromLiveResponse({
                      ...timeInfo,
                      continuationContents: (response as LiveResponse)
                          .continuationContents,
                  });

            const {
                result: chatItemsWithWidth,
                runtime: getEleRuntime,
            } = await benchmarkAsync(
                async () =>
                    assignChatItemRenderedWidth({
                        chatItems,
                        settings: settingsStorage.storageInstance.settings,
                    }),
                this.isDebugging,
            );

            this.chatItemProcessQueue.push(...chatItemsWithWidth);

            this.emitDebugInfoEvent({
                getEleWidthBenchmark: getEleRuntime,
                processChatEventQueueLength: this.chatItemProcessQueue.length,
            });
        }, this.isDebugging);

        this.emitDebugInfoEvent({
            processXhrResponseMs: runtime,
            processChatEventQueueLength: this.chatItemProcessQueue.length,
        });
    }

    private cleanOutdatedChatItems(parameters: {
        currentTimeInUsec: number;
        currentPlayerTimeInMsc: number;
    }): void {
        const beforeCount = this.chatItemProcessQueue.length;

        this.chatItemProcessQueue = this.chatItemProcessQueue.filter(
            (chatItem) => {
                const factor = getOutdatedFactor(chatItem);
                return (
                    chatItem.chatType === 'pinned' ||
                    !isOutdatedChatItem({
                        factor,
                        currentPlayerTimeInMsc:
                            parameters.currentPlayerTimeInMsc,
                        chatItemAtVideoTimestampInMs:
                            chatItem.videoTimestampInMs,
                    })
                );
            },
        );

        const afterCount = this.chatItemProcessQueue.length;

        this.emitDebugInfoEvent({
            outdatedChatEventCount: beforeCount - afterCount,
        });
    }
}
