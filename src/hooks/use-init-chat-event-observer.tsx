import React, { useEffect, useContext, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector, useStore } from 'react-redux';

import { benchmarkAsync } from '@/utils';
import { getVideoEle } from '@/youtube-utils';
import {
    useInterval,
    useVideoPlayerRect,
    useSettings,
    useDocumentVisible,
    useVideoPlayerState,
} from '@/hooks';
import { ChatEventObserverContext } from '@/contexts/chat-observer';
import { chatEvents, debugInfo } from '@/features';
import type { DebugInfo } from '@/services/chat-event/response-observer';
import type { RootState } from '@/app/live-chat-overlay/store';
import type { ChatItem } from '@/services/chat-event/models';
import type { InitData } from '@/definitions/youtube';
import type { UiChatItem } from '@/components/chat-flow/types';
import type { Settings } from '@/services/settings-storage/types';
import ChatItemRenderer from '@/components/chat-flow/chat-item-renderer';
import {
    getMessageSettings,
    isSuperChatItem,
} from '@/services/chat-event/mapper';

export const CHAT_ITEM_RENDER_ID = 'live-chat-overlay-test-rendering';

interface GetChatItemRenderedWidthParams {
    chatItem: ChatItem;
    settings: Settings;
}

async function getChatItemRenderedWidth({
    chatItem,
    settings,
}: GetChatItemRenderedWidthParams): Promise<number> {
    const containerEle = window.parent.document.querySelector(
        `#${CHAT_ITEM_RENDER_ID}`,
    ) as HTMLElement;

    const tempUiChatItem: UiChatItem = {
        ...chatItem,
        numberOfLines: 0,
        addTimestamp: 0,
        lineNumber: 0,
        elementWidth: 0,
    };

    await new Promise((resolve) => {
        ReactDOM.render(
            <ChatItemRenderer chatItem={tempUiChatItem} settings={settings} />,
            containerEle,
            resolve,
        );
    });

    const rect = containerEle?.children[0].getBoundingClientRect();

    const width = rect?.width;
    if (!width) {
        throw new Error('Unknown error');
    }

    return width;
}

function getRenderedNumOfLinesForChatItem({
    settings,
    chatItem,
}: {
    settings: Settings;
    chatItem: ChatItem;
}): number {
    const messageSettings = getMessageSettings(chatItem, settings);

    return isSuperChatItem(chatItem) && chatItem.messageParts.length === 0
        ? 1
        : messageSettings.numberOfLines;
}

export function useInitChatEventObserver(initData: InitData): void {
    const dispatch = useDispatch();
    const { settings } = useSettings();
    const chatEventObserver = useContext(ChatEventObserverContext);
    const { isPaused, isSeeking } = useVideoPlayerState();
    const store = useStore<RootState>();
    const isDocumentVisible = useDocumentVisible(window.parent.document);
    const isDebugging = useSelector<RootState, boolean>(
        (rootState) => rootState.debugInfo.isDebugging,
    );
    const { width: playerWidth } = useVideoPlayerRect();
    const chatItemBufferRef = useRef<ChatItem>();

    const dequeueChatItem = useCallback(
        (): ChatItem | undefined =>
            chatEventObserver.dequeueChatItem(
                (getVideoEle()?.currentTime ?? 0) * 1000,
            ),
        [chatEventObserver],
    );

    const processChatItem = useCallback(async () => {
        const { isFull } = store.getState().chatEvents;

        // Reset buffer
        if (!isFull) {
            chatItemBufferRef.current = undefined;
        }

        // Try to dequeue in all cases to avoid overflow
        const chatItem = isFull
            ? chatItemBufferRef.current ?? dequeueChatItem()
            : dequeueChatItem();

        if (!chatItem || !isDocumentVisible || isPaused) {
            return;
        }

        const {
            result: elementWidth,
            runtime: getEleWidthRuntime,
        } = await benchmarkAsync(
            () =>
                getChatItemRenderedWidth({
                    chatItem,
                    settings,
                }),
            isDebugging,
        );

        if (isDebugging) {
            dispatch(
                debugInfo.actions.addChatItemEleWidthMetric(getEleWidthRuntime),
            );
        }

        // Set buffer for next loop if it is full after dispatch the chat item
        chatItemBufferRef.current = chatItem;

        dispatch(
            chatEvents.actions.addItem({
                chatItem,
                playerWidth,
                elementWidth,
                numberOfLines: getRenderedNumOfLinesForChatItem({
                    settings,
                    chatItem,
                }),
            }),
        );
    }, [
        store,
        isDocumentVisible,
        isPaused,
        isDebugging,
        dequeueChatItem,
        settings,
        playerWidth,
        dispatch,
    ]);

    useInterval(processChatItem, 300);

    useEffect(() => {
        function handleDebugInfo(info: DebugInfo) {
            if (info.processChatEventMs) {
                dispatch(
                    debugInfo.actions.addProcessChatEventMetric(
                        info.processChatEventMs,
                    ),
                );
            }
            if (info.processXhrResponseMs) {
                dispatch(
                    debugInfo.actions.addProcessXhrMetric(
                        info.processXhrResponseMs,
                    ),
                );
            }
            if (info.processChatEventQueueLength) {
                dispatch(
                    debugInfo.actions.updateProcessChatEventQueueLength(
                        info.processChatEventQueueLength,
                    ),
                );
            }
            if (info.processXhrQueueLength) {
                dispatch(
                    debugInfo.actions.updateProcessXhrQueueLength(
                        info.processXhrQueueLength,
                    ),
                );
            }
            if (info.outdatedChatEventCount) {
                dispatch(
                    debugInfo.actions.addOutdatedRemovedChatEventCount(
                        info.outdatedChatEventCount,
                    ),
                );
            }
        }

        chatEventObserver.on('debug', handleDebugInfo);

        return () => chatEventObserver.off('debug', handleDebugInfo);
    }, [chatEventObserver, dispatch]);

    useEffect(() => {
        if (isPaused) {
            chatEventObserver.stop();
        } else {
            chatEventObserver.start();
        }
    }, [isPaused, chatEventObserver]);

    useEffect(() => {
        if (isSeeking) {
            chatEventObserver.reset();
        }
    }, [isSeeking, chatEventObserver]);

    useEffect(() => {
        chatEventObserver.importInitData(initData);
    }, [initData, chatEventObserver]);

    useEffect(() => {
        if (isDebugging) {
            chatEventObserver.startDebug();
        } else {
            chatEventObserver.stopDebug();
        }
    }, [isDebugging, chatEventObserver]);

    useEffect(() => {
        chatEventObserver.start();

        return (): void => chatEventObserver.stop();
    }, [chatEventObserver]);
}
