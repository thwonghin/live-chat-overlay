import { createEffect, onCleanup } from 'solid-js';
import { createStore } from 'solid-js/store';

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

export type ChatItemStoreValue = {
    chatItemsByLineNumber: Record<number, ChatItemModel[]>;
    stickyChatItems: ChatItemModel[];
};

export type ChatItemStore = {
    removeStickyChatItemById(id: string): void;
    init(initData: InitData): Promise<void>;
} & ChatItemStoreValue;

export const createChatItemStore = (
    chatEventName: string,
    uiStore: UiStore,
    settingsStore: SettingsStore,
    debugInfoStore: DebugInfoStore,
): ChatItemStore => {
    const chatItemStatusById = new Map<string, boolean>();
    let isInitiated = false;
    let mode = Mode.LIVE;
    let tickId: number | undefined;
    let cleanDisplayedIntervalId: number | undefined;
    const chatItemProcessQueue: ChatItemModel[] = [];

    const [state, setState] = createStore<ChatItemStoreValue>({
        chatItemsByLineNumber: {},
        stickyChatItems: [],
    });

    function pause(): void {
        clearAllIntervals();
    }

    function resume(): void {
        createAllIntervals();
    }

    function reset(): void {
        chatItemProcessQueue.splice(0);
        setState('chatItemsByLineNumber', {});
        setState('stickyChatItems', []);
        chatItemStatusById.clear();

        updateDebugInfo({
            processChatEventQueueLength: 0,
        });
    }

    function startDebug(): void {
        updateDebugInfo({
            processChatEventQueueLength: chatItemProcessQueue.length,
        });
    }

    function onPlayerPauseOrResume(isPaused: boolean): void {
        if (isPaused) {
            pause();
        } else {
            resume();
        }
    }

    function onPlayerSeek(isSeeking: boolean): void {
        if (isSeeking) {
            reset();
        }
    }

    function resetNonStickyChatItems(width?: number, height?: number): void {
        setState('chatItemsByLineNumber', {});
        chatItemStatusById.clear();

        // Add back sticky status
        state.stickyChatItems.forEach((chatItem) => {
            chatItemStatusById.set(chatItem.value.id, true);
        });
    }

    function createAllIntervals() {
        clearAllIntervals();

        tickId = window.setInterval(
            dequeueAvailableChatItems,
            DEQUEUE_INTERVAL,
        );

        cleanDisplayedIntervalId = window.setInterval(
            cleanDisplayedChatItems,
            CLEAN_INTERVAL,
        );
    }

    function clearAllIntervals() {
        if (tickId !== undefined) {
            window.clearInterval(tickId);
        }

        if (cleanDisplayedIntervalId !== undefined) {
            window.clearInterval(cleanDisplayedIntervalId);
        }
    }

    function getCurrentTimeInfo(): {
        playerTimestampMs: number;
        currentTimestampMs: number;
    } {
        return {
            playerTimestampMs:
                uiStore.playerState.videoCurrentTimeInSecs * 1000,
            currentTimestampMs: Date.now(),
        };
    }

    function updateDebugInfo(info: DebugInfo) {
        if (!debugInfoStore.isDebugging) {
            return;
        }

        if (info.processChatEventMs) {
            debugInfoStore.addProcessChatEventMetric(info.processChatEventMs);
        }

        if (info.processXhrResponseMs) {
            debugInfoStore.addProcessXhrMetric(info.processXhrResponseMs);
        }

        if (info.processChatEventQueueLength) {
            debugInfoStore.updateProcessChatEventQueueLength(
                info.processChatEventQueueLength,
            );
        }

        if (info.outdatedChatEventCount) {
            debugInfoStore.addOutdatedRemovedChatEventCount(
                info.outdatedChatEventCount,
            );
        }

        if (info.getEleWidthBenchmark) {
            debugInfoStore.addChatItemEleWidthMetric(info.getEleWidthBenchmark);
        }

        if (info.cleanedChatItemCount) {
            debugInfoStore.addCleanedChatItemCount(info.cleanedChatItemCount);
        }

        // Meaningless to measure this in replay mode
        if (mode === Mode.LIVE && info.liveChatDelayInMs) {
            debugInfoStore.addLiveChatDelay(info.liveChatDelayInMs);
        }
    }

    async function onChatMessage(event: Event): Promise<void> {
        const customEvent =
            event as CustomEvent<fetchInterceptor.CustomEventDetail>;

        const response = customEvent.detail.response as
            | YoutubeChatResponse
            | InitData
            | undefined;

        if (!response) {
            return;
        }

        await processChatItems(response);
    }

    function dequeueAvailableChatItems() {
        if (!isInitiated) {
            return;
        }

        while (dequeueChatItem()) {
            continue;
        }
    }

    /**
     * Dequeue a chat item from processed item queue
     *
     * @returns {boolean} - Whether we can continue to dequeue
     */
    function dequeueChatItem(): boolean {
        const currentPlayerTimeInMsc =
            uiStore.playerState.videoCurrentTimeInSecs * 1000;

        const chatItem = chatItemProcessQueue[0];

        if (!chatItem) {
            return false;
        }

        // Somehow duplicated
        if (chatItemStatusById.get(chatItem.value.id)) {
            chatItemProcessQueue.shift();
            return true;
        }

        // Outdated, continue next dequeue
        if (isOutdatedChatItemForPlayerTime(chatItem, currentPlayerTimeInMsc)) {
            updateDebugInfo({
                outdatedChatEventCount: 1,
                liveChatDelayInMs:
                    currentPlayerTimeInMsc - chatItem.value.videoTimestampInMs,
            });
            chatItemProcessQueue.shift();
            return true;
        }

        const { result: isTime, runtime } = benchmark(() => {
            return (
                chatItem.value.chatType === 'pinned' ||
                isTimeToDispatch({
                    chatItem: chatItem.value,
                    currentPlayerTimeInMsc,
                })
            );
        }, debugInfoStore.isDebugging);

        updateDebugInfo({
            processChatEventMs: runtime,
            processChatEventQueueLength: chatItemProcessQueue.length,
        });

        if (!isTime) {
            return false;
        }

        updateDebugInfo({
            liveChatDelayInMs:
                currentPlayerTimeInMsc - chatItem.value.videoTimestampInMs,
        });

        const addTimestamp = Date.now();
        const { settings } = settingsStore;
        const { messageSettings } = chatItem;

        if (messageSettings.isSticky) {
            chatItem.assignDisplayMeta(-1, addTimestamp);
            chatItemStatusById.set(chatItem.value.id, true);
            setState('stickyChatItems', [...state.stickyChatItems, chatItem]);
            chatItemProcessQueue.shift();
            return true;
        }

        if (!chatItem.width) {
            throw new Error(`Unknown width for ${chatItem.value.id}`);
        }

        const lineNumber = getLineNumber({
            chatItemsByLineNumber: state.chatItemsByLineNumber,
            addTimestamp,
            elementWidth: chatItem.width,
            maxLineNumber: settings.totalNumberOfLines,
            flowTimeInSec: settings.flowTimeInSec,
            containerWidth: uiStore.playerState.width,
            displayNumberOfLines: chatItem.numberOfLines,
        });

        // No place to insert
        if (lineNumber === undefined) {
            return false;
        }

        chatItem.assignDisplayMeta(lineNumber, addTimestamp);

        for (let i = lineNumber; i < lineNumber + chatItem.numberOfLines; i++) {
            if (state.chatItemsByLineNumber[i]) {
                setState('chatItemsByLineNumber', i, [
                    ...state.chatItemsByLineNumber[i]!,
                    chatItem,
                ]);
            } else {
                setState('chatItemsByLineNumber', i, [chatItem]);
            }
        }

        chatItemStatusById.set(chatItem.value.id, true);
        chatItemProcessQueue.shift();

        return true;
    }

    function isOutdatedChatItemForPlayerTime(
        chatItem: ChatItemModel,
        currentPlayerTimeInMsc: number,
    ): boolean {
        if (chatItem.value.chatType === 'pinned') {
            return false;
        }

        if (mode === Mode.LIVE && !chatItem.isInitData) {
            return false;
        }

        const factor = getOutdatedFactor(chatItem.value);
        return isOutdatedChatItem({
            factor,
            currentPlayerTimeInMsc,
            chatItemAtVideoTimestampInMs: chatItem.value.videoTimestampInMs,
        });
    }

    function cleanDisplayedChatItems(): void {
        const currentTimestamp = Date.now();
        const flowTimeInMs = settingsStore.settings.flowTimeInSec * 1000;

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
                chatItemStatusById.delete(chatItem.value.id);
                cleanedChatItemCount++;
            }

            return !shouldRemove;
        };

        for (const lineNumber in Object.keys(state.chatItemsByLineNumber)) {
            setState('chatItemsByLineNumber', Number(lineNumber), (s) =>
                s.filter(finishedChatItem),
            );
        }

        updateDebugInfo({ cleanedChatItemCount });
    }

    async function processChatItems(
        response: YoutubeChatResponse | InitData,
    ): Promise<void> {
        const { continuationContents } = response;

        if (!continuationContents) {
            return;
        }

        const isInitData = youtube.isInitData(response);

        if (isInitData) {
            reset();
        }

        const { runtime } = await benchmarkAsync(async () => {
            const timeInfo = getCurrentTimeInfo();
            const chatItems =
                mode === Mode.REPLAY
                    ? mapChatItemsFromReplayResponse(
                          timeInfo,
                          continuationContents as ReplayContinuationContents,
                          settingsStore.settings,
                          isInitData,
                      )
                    : mapChatItemsFromLiveResponse(
                          timeInfo,
                          continuationContents as LiveContinuationContents,
                          settingsStore.settings,
                          isInitData,
                      );

            const { runtime: getEleRuntime } = await benchmarkAsync(
                async () => assignChatItemRenderedWidth(chatItems),
                debugInfoStore.isDebugging,
            );

            chatItems.forEach((item) => {
                chatItemProcessQueue.push(item);
            });

            updateDebugInfo({
                getEleWidthBenchmark: getEleRuntime,
                processChatEventQueueLength: chatItemProcessQueue.length,
            });
        }, debugInfoStore.isDebugging);

        updateDebugInfo({
            processXhrResponseMs: runtime,
            processChatEventQueueLength: chatItemProcessQueue.length,
        });
    }

    async function importInitData(initData: InitData): Promise<void> {
        mode = isReplayInitData(initData) ? Mode.REPLAY : Mode.LIVE;
        await processChatItems(initData);
        isInitiated = true;
        createAllIntervals();
    }

    async function init(initData: InitData) {
        window.addEventListener(chatEventName, onChatMessage);

        createEffect(() => {
            onPlayerPauseOrResume(uiStore.playerState.isPaused);
        });

        createEffect(() => {
            onPlayerSeek(uiStore.playerState.isSeeking);
        });

        createEffect(() => {
            resetNonStickyChatItems(
                uiStore.playerState.width,
                uiStore.playerState.height,
            );
        });

        createEffect(() => {
            if (debugInfoStore.isDebugging) {
                startDebug();
            }
        });

        onCleanup(() => {
            window.removeEventListener(chatEventName, onChatMessage);
            clearAllIntervals();
        });

        await importInitData(initData);
    }

    return {
        ...state,
        init,
        removeStickyChatItemById(id: string): void {
            chatItemStatusById.delete(id);
            setState('stickyChatItems', (s) =>
                s.filter((chatItem) => chatItem.value.id !== id),
            );
        },
    };
};
