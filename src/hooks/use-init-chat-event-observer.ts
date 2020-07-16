import { useEffect, useContext, useCallback, useRef } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';

import { getVideoEle } from '@/youtube-utils';
import { useInterval } from '@/hooks/use-interval';
import { useVideoPlayerRect } from '@/hooks/use-video-player-rect';
import { useSettings } from '@/hooks/use-settings';
import { useDocumentVisible } from '@/hooks/use-document-visible';
import { useVideoPlayerState } from '@/hooks/use-video-player-state';
import { ChatEventObserverContext } from '@/contexts/chat-observer';
import { chatEventsActions } from '@/reducers/chat-events';
import { debugInfoActions } from '@/reducers/debug-info';
import { DebugInfo } from '@/services/chat-event/response-observer';
import { RootState } from '@/reducers';
import { ChatItem } from '@/services/chat-event/models';
import { InitData } from '@/definitions/youtube';

export function useInitChatEventObserver(initData: InitData): void {
    const dispatch = useDispatch();
    const settings = useSettings();
    const chatEventObserver = useContext(ChatEventObserverContext);
    const { isPaused, isSeeking } = useVideoPlayerState();
    const store = useStore<RootState>();
    const isDocumentVisible = useDocumentVisible(window.parent.document);
    const isDebugging = useSelector<RootState, boolean>(
        (rootState) => rootState.debugInfo.isDebugging,
    );
    const { width, height } = useVideoPlayerRect();
    const chatItemBufferRef = useRef<ChatItem>();

    const processChatItem = useCallback(() => {
        const { isFull } = store.getState().chatEvents;

        function dequeue(): ChatItem | undefined {
            return chatEventObserver.dequeueChatItem({
                currentPlayerTimeInMsc:
                    (getVideoEle()?.currentTime ?? 0) * 1000,
                chatDisplayTimeInMs: settings.settings.flowTimeInSec * 1000,
            });
        }

        if (!isDocumentVisible || isPaused) {
            // Still dequeue in background to avoid overflow
            dequeue();
            return;
        }

        const chatItem = isFull
            ? chatItemBufferRef.current ?? dequeue()
            : dequeue();

        if (!chatItem) {
            return;
        }

        chatItemBufferRef.current = chatItem;

        dispatch(
            chatEventsActions.addItem({
                chatItem,
                playerRect: { width, height },
            }),
        );
    }, [
        store,
        dispatch,
        width,
        height,
        chatEventObserver,
        settings.settings.flowTimeInSec,
        isDocumentVisible,
        isPaused,
    ]);

    useInterval(processChatItem, 300);

    useEffect(() => {
        function handleDebugInfo(debugInfo: DebugInfo) {
            if (debugInfo.processChatEventMs) {
                dispatch(
                    debugInfoActions.addProcessChatEventMetric(
                        debugInfo.processChatEventMs,
                    ),
                );
            }
            if (debugInfo.processXhrResponseMs) {
                dispatch(
                    debugInfoActions.addProcessXhrMetric(
                        debugInfo.processXhrResponseMs,
                    ),
                );
            }
            if (debugInfo.processChatEventQueueLength) {
                dispatch(
                    debugInfoActions.updateProcessChatEventQueueLength(
                        debugInfo.processChatEventQueueLength,
                    ),
                );
            }
            if (debugInfo.processXhrQueueLength) {
                dispatch(
                    debugInfoActions.updateProcessXhrQueueLength(
                        debugInfo.processXhrQueueLength,
                    ),
                );
            }
            if (debugInfo.outdatedChatEventCount) {
                dispatch(
                    debugInfoActions.addOutdatedRemovedChatEventCount(
                        debugInfo.outdatedChatEventCount,
                    ),
                );
            }
        }

        chatEventObserver.addEventListener('debug', handleDebugInfo);

        return () =>
            chatEventObserver.removeEventListener('debug', handleDebugInfo);
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
