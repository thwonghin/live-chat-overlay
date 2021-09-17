import { useEffect, useContext, useCallback, useRef } from 'react';

import { useDispatch, useSelector, useStore } from 'react-redux';

import type { RootState } from '@/app/live-chat-overlay/store';
import { ChatEventObserverContext } from '@/contexts/chat-observer';
import type { InitData } from '@/definitions/youtube';
import { chatEvents, debugInfo } from '@/features';
import {
    useAnimationFrame,
    useVideoPlayerRect,
    useSettings,
    useVideoPlayerState,
} from '@/hooks';
import { settingsStorage, chatEvent } from '@/services';

function getRenderedNumberOfLinesForChatItem({
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
    const { settings } = useSettings();
    const chatEventObserver = useContext(ChatEventObserverContext);
    const { isPaused, isSeeking } = useVideoPlayerState();
    const store = useStore<RootState>();
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
        const chatItem = chatItemBufferRef.current ?? dequeueChatItem();

        if (!chatItem || isPaused) {
            return;
        }

        dispatch(
            chatEvents.actions.addItem({
                chatItem,
                playerWidth,
                numberOfLines: getRenderedNumberOfLinesForChatItem({
                    settings,
                    chatItem,
                }),
            }),
        );

        const { lastLineNumber } = store.getState().chatEvents;
        // Set buffer for next loop if it is full after dispatch the chat item
        if (lastLineNumber === null) {
            chatItemBufferRef.current = chatItem;
        } else {
            chatItemBufferRef.current = undefined;
        }
    }, [store, isPaused, dequeueChatItem, settings, playerWidth, dispatch]);

    useAnimationFrame(processChatItem);

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

        return () => {
            chatEventObserver.off('debug', handleDebugInfo);
        };
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
