import { useEffect, useContext, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector, useStore } from 'react-redux';

import { benchmarkAsync } from '@/utils';
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
import type { UiChatItem } from '@/components/chat-flow/types';
import ChatItemRenderer from '@/components/chat-flow/chat-item-renderer';

export const CHAT_ITEM_RENDER_ID = 'live-chat-overlay-test-rendering';

interface GetChatItemRenderedWidthParams {
    chatItem: chatEvent.ChatItem;
    settings: settingsStorage.Settings;
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

    await new Promise<void>((resolve) => {
        ReactDOM.render(
            <ChatItemRenderer chatItem={tempUiChatItem} settings={settings} />,
            containerEle,
            resolve,
        );
    });

    const rect = containerEle?.children[0]?.getBoundingClientRect();

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

    const processChatItem = useCallback(async () => {
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

            const {
                result: elementWidth,
                runtime: getEleWidthRuntime,
                // eslint-disable-next-line no-await-in-loop
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
                    debugInfo.actions.addChatItemEleWidthMetric(
                        getEleWidthRuntime,
                    ),
                );
            }

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
        isDebugging,
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

        return (): void => {
            chatEventObserver.stop();
            chatEventObserver.reset();
            dispatch(chatEvents.actions.reset());
            dispatch(debugInfo.actions.reset());
        };
    }, [chatEventObserver, dispatch]);
}
