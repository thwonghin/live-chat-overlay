import {
    makeAutoObservable,
    reaction,
    observable,
    runInAction,
    type IReactionDisposer,
} from 'mobx';

import type {
    YoutubeChatResponse,
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
import type { UiStore } from '../ui';

export { CHAT_ITEM_RENDER_ID } from './get-chat-item-render-container-ele';

type DebugInfo = Partial<{
    processXhrResponseMs: number;
    processChatEventMs: number;
    processChatEventQueueLength: number;
    outdatedChatEventCount: number;
    cleanedChatItemCount: number;
    getEleWidthBenchmark: number;
    liveChatDelayInMs: number;
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
    private isInitiated = false;
    private mode = Mode.LIVE;
    private tickId: number | undefined = undefined;
    private cleanDisplayedIntervalId: number | undefined = undefined;
    private readonly chatItemProcessQueue: ChatItemModel[] = [];
    private readonly reactionDisposers: IReactionDisposer[] = [];

    constructor(
        private readonly chatEventName: string,
        private readonly uiStore: UiStore,
        private readonly settingsStore: SettingsStore,
        private readonly debugInfoStore: DebugInfoStore,
    ) {
        makeAutoObservable(this);
    }

    public async importInitData(initData: InitData): Promise<void> {
        this.mode = isReplayInitData(initData) ? Mode.REPLAY : Mode.LIVE;
        await this.processChatItems(initData);
        this.isInitiated = true;
    }

    public init(): void {
        window.addEventListener(this.chatEventName, this.onChatMessage);

        this.reactionDisposers.push(
            reaction(
                () => this.debugInfoStore.isDebugging,
                this.watchDebugStore,
            ),
        );
        this.reactionDisposers.push(
            reaction(
                () => [
                    this.uiStore.playerState.width,
                    this.uiStore.playerState.height,
                ],
                this.resetNonStickyChatItems,
            ),
        );
        this.reactionDisposers.push(
            reaction(
                () => this.uiStore.playerState.isPaused,
                this.onPlayerPauseOrResume,
            ),
        );
        this.reactionDisposers.push(
            reaction(
                () => this.uiStore.playerState.isSeeking,
                this.onPlayerSeek,
            ),
        );

        this.createAllIntervals();
    }

    public cleanup(): void {
        window.removeEventListener(this.chatEventName, this.onChatMessage);
        this.reactionDisposers.forEach((disposer) => {
            disposer();
        });
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

    private readonly onPlayerPauseOrResume = (): void => {
        if (this.uiStore.playerState.isPaused) {
            this.pause();
        } else {
            this.resume();
        }
    };

    private readonly onPlayerSeek = (): void => {
        if (this.uiStore.playerState.isSeeking) {
            this.reset();
        }
    };

    private readonly resetNonStickyChatItems = (): void => {
        runInAction(() => {
            this.chatItemsByLineNumber.clear();
            this.chatItemStatusById.clear();

            // Add back sticky status
            this.stickyChatItems.forEach((chatItem) => {
                this.chatItemStatusById.set(chatItem.value.id, true);
            });
        });
    };

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
            playerTimestampMs:
                this.uiStore.playerState.videoCurrentTimeInSecs * 1000,
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

            if (info.liveChatDelayInMs) {
                this.debugInfoStore.debugInfoModel.addLiveChatDelay(
                    info.liveChatDelayInMs,
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

            const isInitData = youtube.isInitData(response);

            if (isInitData) {
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
                              isInitData,
                          )
                        : mapChatItemsFromLiveResponse(
                              timeInfo,
                              continuationContents as LiveContinuationContents,
                              this.settingsStore.settings,
                              isInitData,
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
        if (!this.isInitiated) {
            return;
        }

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
        const currentPlayerTimeInMsc =
            this.uiStore.playerState.videoCurrentTimeInSecs * 1000;

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
        const { messageSettings } = chatItem;

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
            containerWidth: this.uiStore.playerState.width,
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
                if (!chatItem.isInitData) {
                    this.updateDebugInfo({
                        liveChatDelayInMs:
                            parameters.currentPlayerTimeInMsc -
                            chatItem.value.videoTimestampInMs,
                    });
                }

                if (this.mode === Mode.LIVE && !chatItem.isInitData) {
                    return true;
                }

                const factor = getOutdatedFactor(chatItem.value);
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
