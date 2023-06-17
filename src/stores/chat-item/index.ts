import { makeAutoObservable, reaction, observable, runInAction } from 'mobx';

import type {
    YoutubeChatResponse,
    ReplayResponse,
    LiveResponse,
    InitData,
    ReplayContinuationContents,
    LiveContinuationContents,
} from '@/definitions/youtube';
import type { ChatItemModel } from '@/models/chat-item';
import type { fetchInterceptor } from '@/services';
import { benchmark, benchmarkAsync, filterInPlace, youtube } from '@/utils';

import { assignChatItemRenderedWidth } from './get-chat-item-render-container-ele';
import {
    mapChatItemsFromReplayResponse,
    mapChatItemsFromLiveResponse,
    isTimeToDispatch,
    isOutdatedChatItem,
    getOutdatedFactor,
    isReplayInitData,
    getLineNumber,
    Mode,
} from './helpers';
import type { DebugInfoStore } from '../debug-info';
import type { SettingsStore } from '../settings';

export { CHAT_ITEM_RENDER_ID } from './get-chat-item-render-container-ele';

type DebugInfo = Partial<{
    processXhrResponseMs: number;
    processChatEventMs: number;
    processChatEventQueueLength: number;
    outdatedChatEventCount: number;
    cleanedChatItemCount: number;
    getEleWidthBenchmark: number;
}>;

const DEQUEUE_INTERVAL = 1000 / 60; // 5 FPS
const CLEAN_INTERVAL = 1000;

export class ChatItemStore {
    public readonly chatItemsByLineNumber = observable.map<
        number,
        ChatItemModel[]
    >();

    public readonly stickyChatItems = observable.array<ChatItemModel>();

    private readonly chatItemStatusById = new Map<string, boolean>();
    private mode = Mode.LIVE;
    private isStarted = false;
    private tickId: number | undefined = undefined;
    private cleanDisplayedIntervalId: number | undefined = undefined;
    private readonly chatItemProcessQueue: ChatItemModel[] = [];

    // eslint-disable-next-line max-params
    constructor(
        private readonly chatEventName: string,
        private readonly videoEle: HTMLVideoElement,
        private readonly videoPlayerEle: HTMLDivElement,
        private readonly settingsStore: SettingsStore,
        private readonly debugInfoStore: DebugInfoStore,
    ) {
        reaction(() => this.debugInfoStore.isDebugging, this.watchDebugStore);
        makeAutoObservable(this);
    }

    public async importInitData(initData: InitData): Promise<void> {
        this.mode = isReplayInitData(initData) ? Mode.REPLAY : Mode.LIVE;
        await this.processChatItems(initData);
    }

    public start(): void {
        if (this.isStarted) {
            return;
        }

        this.isStarted = true;
        window.addEventListener(this.chatEventName, this.onChatMessage);
        this.createAllIntervals();
    }

    public stop(): void {
        if (!this.isStarted) {
            return;
        }

        this.isStarted = false;
        window.removeEventListener(this.chatEventName, this.onChatMessage);
        this.clearAllIntervals();
    }

    public pause(): void {
        this.clearAllIntervals();
    }

    public resume(): void {
        this.createAllIntervals();
    }

    public reset(): void {
        this.chatItemProcessQueue.splice(0);
        this.chatItemsByLineNumber.clear();
        this.chatItemStatusById.clear();

        this.updateDebugInfo({
            processChatEventQueueLength: 0,
        });
    }

    public resetNonStickyChatItems(): void {
        this.chatItemsByLineNumber.clear();
        this.chatItemStatusById.clear();

        // Add back sticky status
        this.stickyChatItems.forEach((chatItem) => {
            this.chatItemStatusById.set(chatItem.value.id, true);
        });
    }

    public startDebug(): void {
        this.updateDebugInfo({
            processChatEventQueueLength: this.chatItemProcessQueue.length,
        });
    }

    public removeStickyChatItemById(id: string): void {
        this.chatItemStatusById.delete(id);
        filterInPlace(
            this.stickyChatItems,
            (chatItem) => chatItem.value.id !== id,
        );
    }

    private createAllIntervals() {
        this.clearAllIntervals();

        this.tickId = window.setInterval(
            this.dequeueAvailableChatItems,
            DEQUEUE_INTERVAL,
        );

        this.cleanDisplayedIntervalId = window.setInterval(
            this.cleanDisplayedChatItems,
            CLEAN_INTERVAL,
        );
    }

    private clearAllIntervals() {
        if (this.tickId !== undefined) {
            window.clearInterval(this.tickId);
        }

        if (this.cleanDisplayedIntervalId !== undefined) {
            window.clearInterval(this.cleanDisplayedIntervalId);
        }
    }

    private getCurrentTimeInfo(): {
        playerTimestampMs: number;
        currentTimestampMs: number;
    } {
        return {
            playerTimestampMs: this.videoEle.currentTime * 1000,
            currentTimestampMs: Date.now(),
        };
    }

    private updateDebugInfo(info: DebugInfo) {
        runInAction(() => {
            if (!this.debugInfoStore.isDebugging) {
                return;
            }

            if (info.processChatEventMs) {
                this.debugInfoStore.debugInfoModel.addProcessChatEventMetric(
                    info.processChatEventMs,
                );
            }

            if (info.processXhrResponseMs) {
                this.debugInfoStore.debugInfoModel.addProcessXhrMetric(
                    info.processXhrResponseMs,
                );
            }

            if (info.processChatEventQueueLength) {
                this.debugInfoStore.debugInfoModel.updateProcessChatEventQueueLength(
                    info.processChatEventQueueLength,
                );
            }

            if (info.outdatedChatEventCount) {
                this.debugInfoStore.debugInfoModel.addOutdatedRemovedChatEventCount(
                    info.outdatedChatEventCount,
                );
            }

            if (info.getEleWidthBenchmark) {
                this.debugInfoStore.debugInfoModel.addChatItemEleWidthMetric(
                    info.getEleWidthBenchmark,
                );
            }

            if (info.cleanedChatItemCount) {
                this.debugInfoStore.debugInfoModel.addCleanedChatItemCount(
                    info.cleanedChatItemCount,
                );
            }
        });
    }

    private readonly watchDebugStore = () => {
        if (this.debugInfoStore.isDebugging) {
            this.startDebug();
        }
    };

    private readonly onChatMessage = async (event: Event): Promise<void> => {
        const customEvent =
            event as CustomEvent<fetchInterceptor.CustomEventDetail>;

        const response = customEvent.detail.response as
            | YoutubeChatResponse
            | InitData
            | undefined;

        if (!response) {
            return;
        }

        await this.processChatItems(response);
    };

    private async processChatItems(
        response: YoutubeChatResponse | InitData,
    ): Promise<void> {
        await runInAction(async () => {
            const { continuationContents } = response;

            if (!continuationContents) {
                return;
            }

            if (youtube.isInitData(response)) {
                this.reset();
            }

            const { runtime } = await benchmarkAsync(async () => {
                const timeInfo = this.getCurrentTimeInfo();
                const chatItems =
                    this.mode === Mode.REPLAY
                        ? mapChatItemsFromReplayResponse(
                              timeInfo,
                              continuationContents as ReplayContinuationContents,
                              this.settingsStore.settings,
                          )
                        : mapChatItemsFromLiveResponse(
                              timeInfo,
                              continuationContents as LiveContinuationContents,
                              this.settingsStore.settings,
                          );

                const { runtime: getEleRuntime } = await benchmarkAsync(
                    async () => assignChatItemRenderedWidth(chatItems),
                    this.debugInfoStore.isDebugging,
                );

                chatItems.forEach((item) => {
                    this.chatItemProcessQueue.push(item);
                });

                this.updateDebugInfo({
                    getEleWidthBenchmark: getEleRuntime,
                    processChatEventQueueLength:
                        this.chatItemProcessQueue.length,
                });
            }, this.debugInfoStore.isDebugging);

            this.updateDebugInfo({
                processXhrResponseMs: runtime,
                processChatEventQueueLength: this.chatItemProcessQueue.length,
            });
        });
    }

    private readonly dequeueAvailableChatItems = () => {
        runInAction(() => {
            while (this.dequeueChatItem()) {
                continue;
            }
        });
    };

    /**
     * Dequeue a chat item from processed item queue
     *
     * @returns {boolean} - Whether we can continue to dequeue
     */
    private dequeueChatItem(): boolean {
        const currentPlayerTimeInMsc = (this.videoEle.currentTime ?? 0) * 1000;

        const currentTimeInUsec = Date.now() * 1000;
        this.cleanOutdatedChatItems({
            currentPlayerTimeInMsc,
            currentTimeInUsec,
        });

        const chatItem = this.chatItemProcessQueue[0];

        if (!chatItem) {
            return false;
        }

        const { result: isTime, runtime } = benchmark(() => {
            return (
                chatItem.value.chatType === 'pinned' ||
                isTimeToDispatch({
                    chatItem: chatItem.value,
                    currentPlayerTimeInMsc,
                })
            );
        }, this.debugInfoStore.isDebugging);

        if (!isTime) {
            this.updateDebugInfo({
                processChatEventMs: runtime,
                processChatEventQueueLength: this.chatItemProcessQueue.length,
            });
            return false;
        }

        // Somehow duplicated
        if (this.chatItemStatusById.get(chatItem.value.id)) {
            this.chatItemProcessQueue.shift();
            return true;
        }

        this.updateDebugInfo({
            processChatEventMs: runtime,
            processChatEventQueueLength: this.chatItemProcessQueue.length,
        });

        const addTimestamp = Date.now();
        const { settings } = this.settingsStore;
        const messageSettings = settings.getMessageSettings(chatItem.value);

        if (messageSettings.isSticky) {
            chatItem.assignDisplayMeta(-1, addTimestamp);
            this.chatItemStatusById.set(chatItem.value.id, true);
            this.stickyChatItems.push(chatItem);
            this.chatItemProcessQueue.shift();
            return true;
        }

        if (!chatItem.width) {
            throw new Error(`Unknown width for ${chatItem.value.id}`);
        }

        const lineNumber = getLineNumber({
            chatItemsByLineNumber: this.chatItemsByLineNumber,
            addTimestamp,
            elementWidth: chatItem.width,
            maxLineNumber: settings.totalNumberOfLines,
            flowTimeInSec: settings.flowTimeInSec,
            containerWidth: this.getPlayerWidth(),
            displayNumberOfLines: chatItem.numberOfLines,
        });

        // No place to insert
        if (lineNumber === undefined) {
            return false;
        }

        chatItem.assignDisplayMeta(lineNumber, addTimestamp);

        for (let i = lineNumber; i < lineNumber + chatItem.numberOfLines; i++) {
            let chatItems = this.chatItemsByLineNumber.get(i);

            if (!chatItems) {
                chatItems = observable.array();
                this.chatItemsByLineNumber.set(i, chatItems);
            }

            chatItems.push(chatItem);
        }

        this.chatItemStatusById.set(chatItem.value.id, true);
        this.chatItemProcessQueue.shift();

        return true;
    }

    private cleanOutdatedChatItems(parameters: {
        currentTimeInUsec: number;
        currentPlayerTimeInMsc: number;
    }): void {
        runInAction(() => {
            const beforeCount = this.chatItemProcessQueue.length;

            filterInPlace(this.chatItemProcessQueue, (chatItem) => {
                const factor =
                    getOutdatedFactor(chatItem.value) *
                    (this.mode === Mode.LIVE ? 3 : 1);
                const isOutdated = isOutdatedChatItem({
                    factor,
                    currentPlayerTimeInMsc: parameters.currentPlayerTimeInMsc,
                    chatItemAtVideoTimestampInMs:
                        chatItem.value.videoTimestampInMs,
                });

                return chatItem.value.chatType === 'pinned' || !isOutdated;
            });

            const afterCount = this.chatItemProcessQueue.length;

            this.updateDebugInfo({
                outdatedChatEventCount: beforeCount - afterCount,
            });
        });
    }

    private getPlayerWidth(): number {
        const rect = this.videoPlayerEle.getBoundingClientRect();
        return rect.width;
    }

    private readonly cleanDisplayedChatItems = (): void => {
        runInAction(() => {
            const currentTimestamp = Date.now();
            const flowTimeInMs =
                this.settingsStore.settings.flowTimeInSec * 1000;

            const cutoffTimestamp = currentTimestamp - flowTimeInMs;

            let cleanedChatItemCount = 0;
            const finishedChatItem = (chatItem: ChatItemModel) => {
                if (chatItem.addTimestamp === undefined) {
                    throw new Error(
                        `Missing AddTimestamp for ${chatItem.value.id}`,
                    );
                }

                const shouldRemove = chatItem.addTimestamp < cutoffTimestamp;
                if (shouldRemove) {
                    this.chatItemStatusById.delete(chatItem.value.id);
                    cleanedChatItemCount++;
                }

                return !shouldRemove;
            };

            for (const chatItems of this.chatItemsByLineNumber.values()) {
                filterInPlace(chatItems, finishedChatItem);
            }

            this.updateDebugInfo({ cleanedChatItemCount });
        });
    };
}
