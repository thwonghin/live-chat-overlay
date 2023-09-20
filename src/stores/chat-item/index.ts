import { createEffect, createRoot, onCleanup, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';

import type {
    YoutubeChatResponse,
    InitData,
    ReplayContinuationContents,
    LiveContinuationContents,
} from '@/definitions/youtube';
import type { ChatItemModel } from '@/models/chat-item';
import type { fetchInterceptor } from '@/services';
import { benchmark, benchmarkAsync, youtube } from '@/utils';
import { createError, logInfo } from '@/utils/logger';

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

type DebugInfo = Partial<{
    processXhrResponseMs: number;
    processChatEventMs: number;
    processChatEventQueueLength: number;
    outdatedChatEventCount: number;
    cleanedChatItemCount: number;
    liveChatDelayInMs: number;
}>;

const DEQUEUE_INTERVAL = 1000 / 60; // 5 FPS
const CLEAN_INTERVAL = 1000;

export type ChatItemStoreValue = {
    normalChatItems: ChatItemModel[];
    stickyChatItems: ChatItemModel[];
};

export type ChatItemStore = {
    value: ChatItemStoreValue;
    cleanup?: () => void;
    removeStickyChatItemById(id: string): void;
    assignChatItemEle(id: string, element: HTMLElement): void;
};

export const createChatItemStore = (
    attachChatEvent: (
        callback: (e: fetchInterceptor.ChatEventDetail) => void,
    ) => () => void,
    uiStore: UiStore,
    settingsStore: SettingsStore,
    debugInfoStore: DebugInfoStore,
    initData: InitData,
    // eslint-disable-next-line max-params
): ChatItemStore => {
    let isInitiated = false;
    const mode = isReplayInitData(initData) ? Mode.REPLAY : Mode.LIVE;
    let tickId: number | undefined;
    let cleanDisplayedIntervalId: number | undefined;

    let normalChatItemQueue: string[] = [];
    const chatItemsByLineNumber = new Map<number, ChatItemModel[]>();
    const chatItemIds = new Set<string>();

    const [state, setState] = createStore<ChatItemStoreValue>({
        normalChatItems: [],
        stickyChatItems: [],
    });

    void processChatItems(initData).then(() => {
        isInitiated = true;
    });

    function pause(): void {
        clearAllIntervals();
    }

    function resume(): void {
        createAllIntervals();
    }

    function reset(): void {
        chatItemsByLineNumber.clear();
        chatItemIds.clear();
        normalChatItemQueue = [];

        setState('normalChatItems', []);
        setState('stickyChatItems', []);

        updateDebugInfo({
            processChatEventQueueLength: 0,
        });
    }

    function startDebug(): void {
        updateDebugInfo({
            processChatEventQueueLength: normalChatItemQueue.length,
        });
    }

    function onPlayerPauseOrResume(isPaused: boolean): void {
        if (isPaused) {
            pause();
        } else {
            resume();
        }
    }

    function resetNonStickyChatItems(width?: number, height?: number): void {
        setState('normalChatItems', (items) =>
            // Only remove the items that are displaying
            items.filter((item) => !item.addTimestamp),
        );
        chatItemIds.clear();
        state.normalChatItems.forEach((chatItem) => {
            chatItemIds.add(chatItem.value.id);
        });
        state.stickyChatItems.forEach((chatItem) => {
            chatItemIds.add(chatItem.value.id);
        });
        normalChatItemQueue = normalChatItemQueue.filter((itemId) =>
            chatItemIds.has(itemId),
        );

        chatItemsByLineNumber.clear();
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
        if (!debugInfoStore.debugInfo.isDebugging) {
            return;
        }

        if (info.processChatEventMs !== undefined) {
            debugInfoStore.addProcessChatEventMetric(info.processChatEventMs);
        }

        if (info.processXhrResponseMs !== undefined) {
            debugInfoStore.addProcessXhrMetric(info.processXhrResponseMs);
        }

        if (info.processChatEventQueueLength !== undefined) {
            debugInfoStore.updateProcessChatEventQueueLength(
                info.processChatEventQueueLength,
            );
        }

        if (info.outdatedChatEventCount !== undefined) {
            debugInfoStore.addOutdatedRemovedChatEventCount(
                info.outdatedChatEventCount,
            );
        }

        if (info.cleanedChatItemCount !== undefined) {
            debugInfoStore.addCleanedChatItemCount(info.cleanedChatItemCount);
        }

        // Meaningless to measure this in replay mode
        if (mode === Mode.LIVE && info.liveChatDelayInMs !== undefined) {
            debugInfoStore.addLiveChatDelay(info.liveChatDelayInMs);
        }
    }

    async function onChatMessageEvent(
        event: fetchInterceptor.ChatEventDetail,
    ): Promise<void> {
        const response = event.response as
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

        while (dequeueNormalChatItem()) {
            continue;
        }
    }

    function assignChatItemEle(chatItemId: string, element: HTMLElement) {
        // Storing ele instead of width here so we can get the latest width value
        // when the player size is updated
        setState('normalChatItems', (item) => item.value.id === chatItemId, {
            element,
        });
    }

    /**
     * Dequeue a chat item from processed item queue
     *
     * @returns {boolean} - Whether we can continue to dequeue
     */
    function dequeueNormalChatItem(): boolean {
        const currentPlayerTimeInMsc =
            uiStore.playerState.videoCurrentTimeInSecs * 1000;

        const chatItemId = normalChatItemQueue[0];

        if (!chatItemId) {
            return false;
        }

        const chatItem = state.normalChatItems.find(
            (item) => item.value.id === chatItemId,
        );
        if (!chatItem) {
            throw createError(`Chat Item not found for id = ${chatItemId}`);
        }

        // Outdated, continue next dequeue
        if (isOutdatedChatItemForPlayerTime(chatItem, currentPlayerTimeInMsc)) {
            logInfo('Outdated chat item', chatItem.value.id);
            updateDebugInfo({
                outdatedChatEventCount: 1,
                liveChatDelayInMs:
                    currentPlayerTimeInMsc - chatItem.value.videoTimestampInMs,
            });

            chatItemIds.delete(chatItemId);
            setState('normalChatItems', (s) =>
                s.filter((item) => item.value.id !== chatItemId),
            );

            normalChatItemQueue.shift();
            return true;
        }

        const { result: isTime, runtime } = benchmark(() => {
            return isTimeToDispatch({
                chatItem: chatItem.value,
                currentPlayerTimeInMsc,
            });
        }, debugInfoStore.debugInfo.isDebugging);

        updateDebugInfo({
            processChatEventMs: runtime,
            processChatEventQueueLength: normalChatItemQueue.length,
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

        // Wait until the width is determined
        if (!chatItem.element) {
            return false;
        }

        const lineNumber = getLineNumber({
            chatItemsByLineNumber,
            elementWidth: chatItem.element.getBoundingClientRect().width,
            addTimestamp,
            maxLineNumber: settings.totalNumberOfLines,
            flowTimeInSec: settings.flowTimeInSec,
            containerWidth: uiStore.playerState.width,
            displayNumberOfLines: chatItem.numberOfLines,
        });

        // No place to insert
        if (lineNumber === undefined) {
            return false;
        }

        for (let i = lineNumber; i < lineNumber + chatItem.numberOfLines; i++) {
            const line = chatItemsByLineNumber.get(i);
            if (line) {
                line.push(chatItem);
            } else {
                chatItemsByLineNumber.set(i, [chatItem]);
            }
        }

        setState(
            'normalChatItems',
            (item) => item.value.id === chatItem.value.id,
            {
                lineNumber,
                addTimestamp,
                // Freeze the width value for performance
                // This item should be removed anyway when the player width is updated
                width: chatItem.element?.getBoundingClientRect().width,
            },
        );

        normalChatItemQueue.shift();

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
        if (!isInitiated) {
            return;
        }

        const currentTimestamp = Date.now();
        const flowTimeInMs = settingsStore.settings.flowTimeInSec * 1000;

        const cutoffTimestamp = currentTimestamp - flowTimeInMs;

        let cleanedChatItemCount = 0;

        function shouldKeepChatItem(item: ChatItemModel) {
            if (item.addTimestamp === undefined) {
                // Waiting to be added, keep it
                return true;
            }

            return item.addTimestamp >= cutoffTimestamp;
        }

        state.normalChatItems.forEach((chatItem) => {
            if (shouldKeepChatItem(chatItem)) {
                return;
            }

            if (chatItem.lineNumber === undefined) {
                throw createError(
                    `Unknown line number for ${chatItem.value.id}`,
                );
            }

            const line = chatItemsByLineNumber.get(chatItem.lineNumber) ?? [];
            const index = line.findIndex(
                (i) => i.value.id === chatItem.value.id,
            );

            if (index === -1) {
                throw createError(
                    `Unknown index in line number ${chatItem.lineNumber} for ${chatItem.value.id}`,
                );
            }

            line.splice(
                line.findIndex((i) => i.value.id === chatItem.value.id),
                1,
            );
            chatItemIds.delete(chatItem.value.id);
            cleanedChatItemCount++;
        });

        setState('normalChatItems', (items) =>
            items.filter(shouldKeepChatItem),
        );

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

            const nonDuplicatedChatItems = chatItems.filter(
                (item) => !chatItemIds.has(item.value.id),
            );
            nonDuplicatedChatItems.forEach((item) => {
                chatItemIds.add(item.value.id);
            });

            const stickyChatItems = nonDuplicatedChatItems.filter(
                (chatItem) => chatItem.messageSettings.isSticky,
            );
            const normalChatItems = nonDuplicatedChatItems.filter(
                (chatItem) => !chatItem.messageSettings.isSticky,
            );
            normalChatItemQueue.push(
                ...normalChatItems.map((item) => item.value.id),
            );

            setState('normalChatItems', (s) => s.concat(normalChatItems));
            setState('stickyChatItems', (s) => s.concat(stickyChatItems));

            updateDebugInfo({
                processChatEventQueueLength: normalChatItemQueue.length,
            });
        }, debugInfoStore.debugInfo.isDebugging);

        updateDebugInfo({
            processXhrResponseMs: runtime,
            processChatEventQueueLength: normalChatItemQueue.length,
        });
    }

    function removeStickyChatItemById(id: string): void {
        chatItemIds.delete(id);
        setState('stickyChatItems', (s) =>
            s.filter((chatItem) => chatItem.value.id !== id),
        );
    }

    let cleanup: (() => void) | undefined;

    createRoot((dispose) => {
        onMount(() => {
            logInfo('attach chat event listener');
            const cleanup = attachChatEvent(onChatMessageEvent);
            onCleanup(() => {
                cleanup();
            });
        });

        createEffect((prev) => {
            if (prev === uiStore.playerState.isPaused) {
                return;
            }

            onPlayerPauseOrResume(uiStore.playerState.isPaused);

            return uiStore.playerState.isPaused;
        });

        createEffect((prev) => {
            const newDimension = `${Math.round(
                uiStore.playerState.width,
            )},${Math.round(uiStore.playerState.height)}`;
            if (prev === newDimension) {
                return;
            }

            resetNonStickyChatItems(
                uiStore.playerState.width,
                uiStore.playerState.height,
            );

            return newDimension;
        });

        createEffect((prev) => {
            if (prev === debugInfoStore.debugInfo.isDebugging) {
                return;
            }

            if (debugInfoStore.debugInfo.isDebugging) {
                startDebug();
            }

            return debugInfoStore.debugInfo.isDebugging;
        });

        onCleanup(() => {
            clearAllIntervals();
        });

        cleanup = dispose;
    });

    return {
        value: state,
        cleanup,
        removeStickyChatItemById,
        assignChatItemEle,
    };
};
