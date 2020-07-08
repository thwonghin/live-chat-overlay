import { useEffect, useContext, useCallback, useRef } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';

import { getVideoEle } from '@/youtube-utils';
import { useInterval } from '@/hooks/use-interval';
import { useVideoPlayerRect } from '@/hooks/use-video-player-rect';
import { ChatEventObserverContext } from '@/contexts/chat-observer';
import { chatEventsActions } from '@/reducers/chat-events';
import { debugInfoActions } from '@/reducers/debug-info';
import { DebugInfo } from '@/services/chat-event/response-observer';
import { RootState } from '@/reducers';
import { ChatItem } from '@/services/chat-event/models';

export function useInitChatEventObserver(): void {
    const dispatch = useDispatch();
    const chatEventObserver = useContext(ChatEventObserverContext);
    const store = useStore<RootState>();
    const isDebugging = useSelector<RootState, boolean>(
        (rootState) => rootState.debugInfo.isDebugging,
    );
    const { width, height } = useVideoPlayerRect();
    const chatItemBufferRef = useRef<ChatItem>();

    const processChatItem = useCallback(() => {
        const { isFull } = store.getState().chatEvents;

        const chatItem = isFull
            ? chatItemBufferRef.current ??
              chatEventObserver.dequeueChatItem(
                  (getVideoEle()?.currentTime ?? 0) * 1000,
              )
            : chatEventObserver.dequeueChatItem(
                  (getVideoEle()?.currentTime ?? 0) * 1000,
              );

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
    }, [chatEventObserver, dispatch, height, width, store]);

    useInterval(processChatItem, 100);

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
        }

        chatEventObserver.addEventListener('debug', handleDebugInfo);

        return () =>
            chatEventObserver.removeEventListener('debug', handleDebugInfo);
    }, [chatEventObserver, dispatch]);

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
