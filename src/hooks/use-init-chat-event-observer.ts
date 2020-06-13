import { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useVideoPlayerRect } from '@/hooks/use-video-player-rect';
import { ChatEventObserverContext } from '@/contexts/chat-observer';
import { chatEventsActions } from '@/reducers/chat-events';
import { debugInfoActions } from '@/reducers/debug-info';
import { DebugInfo } from '@/services/chat-event/response-observer';
import { ChatItem } from '@/services/chat-event/models';
import { RootState } from '@/reducers';

export function useInitChatEventObserver(): void {
    const dispatch = useDispatch();
    const chatEventObserver = useContext(ChatEventObserverContext);
    const isDebugging = useSelector<RootState, boolean>(
        (rootState) => rootState.debugInfo.isDebugging,
    );
    const { width, height } = useVideoPlayerRect();

    useEffect(() => {
        function handleChatItems(chatItems: ChatItem[]) {
            chatItems.forEach((chatItem) => {
                dispatch(
                    chatEventsActions.addItem({
                        chatItem,
                        playerRect: { width, height },
                    }),
                );
            });
        }
        chatEventObserver.addEventListener('add', handleChatItems);

        return () =>
            chatEventObserver.removeEventListener('add', handleChatItems);
    }, [dispatch, chatEventObserver, width, height]);

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

        return (): void => chatEventObserver.cleanup();
    }, [chatEventObserver]);
}
