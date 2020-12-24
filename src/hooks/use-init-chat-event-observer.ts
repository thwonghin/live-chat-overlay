import { useEffect, useContext, useCallback, useRef } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';

import {
    useInterval,
    useVideoPlayerRect,
    useSettings,
    useDocumentVisible,
    useVideoPlayerState,
} from '@/hooks';
import { ChatEventObserverContext } from '@/contexts/chat-observer';
import { chatEvents, debugInfo } from '@/features';
import { settingsStorage, chatEvent } from '@/services';
import type { RootState } from '@/app/live-chat-overlay/store';
import type { InitData } from '@/definitions/youtube';

export const CHAT_ITEM_RENDER_ID = 'live-chat-overlay-test-rendering';

function getRenderedNumOfLinesForChatItem({
    settings,
    chatItem,
}: {
    settings: settingsStorage.Settings;
    chatItem: chatEvent.ChatItem;
}): number {
    const messageSettings = chatEvent.getMessageSettings(chatItem, settings);

    return chatEvent.isSuperChatItem(chatItem) &&
        chatItem.messageParts.length === 0
        ? 1
        : messageSettings.numberOfLines;
}

export function useInitChatEventObserver(initData: InitData): void {
    const dispatch = useDispatch();
    const processLock = useRef(true);
    const { settings } = useSettings();
    const chatEventObserver = useContext(ChatEventObserverContext);
    const { isPaused, isSeeking } = useVideoPlayerState();
    const store = useStore<RootState>();
    const isDocumentVisible = useDocumentVisible(window.parent.document);
    const isDebugging = useSelector<RootState, boolean>(
        (rootState) => rootState.debugInfo.isDebugging,
    );
    const { width: playerWidth } = useVideoPlayerRect();
    const chatItemBufferRef = useRef<chatEvent.ChatItem>();

    const dequeueChatItem = useCallback(
        (): chatEvent.ChatItem | undefined =>
            chatEventObserver.dequeueChatItem(),
        [chatEventObserver],
    );

    const processChatItem = useCallback(() => {
        if (!processLock.current) {
            return;
        }
        let shouldQuit = false;
        processLock.current = false;

        while (!shouldQuit) {
            const chatItem = chatItemBufferRef.current ?? dequeueChatItem();

            if (!chatItem || !isDocumentVisible || isPaused) {
                shouldQuit = true;
                break;
            }

            dispatch(
                chatEvents.actions.addItem({
                    chatItem,
                    playerWidth,
                    numberOfLines: getRenderedNumOfLinesForChatItem({
                        settings,
                        chatItem,
                    }),
                }),
            );

            const { lastLineNumber } = store.getState().chatEvents;
            // Set buffer for next loop if it is full after dispatch the chat item
            if (lastLineNumber === null) {
                chatItemBufferRef.current = chatItem;
                shouldQuit = true;
            } else {
                chatItemBufferRef.current = undefined;
            }
        }
        processLock.current = true;
    }, [
        store,
        isDocumentVisible,
        isPaused,
        dequeueChatItem,
        settings,
        playerWidth,
        dispatch,
    ]);

    useInterval(processChatItem, 500);

    useEffect(() => {
        function handleDebugInfo(info: chatEvent.DebugInfo) {
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
            if (info.outdatedChatEventCount) {
                dispatch(
                    debugInfo.actions.addOutdatedRemovedChatEventCount(
                        info.outdatedChatEventCount,
                    ),
                );
            }
            if (info.getEleWidthBenchmark) {
                dispatch(
                    debugInfo.actions.addChatItemEleWidthMetric(
                        info.getEleWidthBenchmark,
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
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
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

        return (): void => {
            chatEventObserver.stop();
            chatEventObserver.reset();
            dispatch(chatEvents.actions.reset());
            dispatch(debugInfo.actions.reset());
        };
    }, [chatEventObserver, dispatch]);
}
