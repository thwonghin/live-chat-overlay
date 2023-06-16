import { useEffect, useContext, useCallback, useRef } from 'react';

import { runInAction } from 'mobx';
import { useDispatch, useStore } from 'react-redux';

import type { RootState } from '@/app/live-chat-overlay/store';
import { ChatEventObserverContext } from '@/contexts/chat-observer';
import { useDebugInfoStore } from '@/contexts/debug-info';
import { useSettings } from '@/contexts/settings';
import type { InitData } from '@/definitions/youtube';
import { chatEvents } from '@/features';
import {
    useAnimationFrame,
    useVideoPlayerRect,
    useVideoPlayerState,
} from '@/hooks';
import { type SettingsModel } from '@/models/settings';
import { chatEvent } from '@/services';

function getRenderedNumberOfLinesForChatItem({
    settings,
    chatItem,
}: {
    settings: SettingsModel;
    chatItem: chatEvent.ChatItem;
}): number {
    const messageSettings = settings.getMessageSettings(chatItem);

    return chatEvent.isSuperChatItem(chatItem) &&
        chatItem.messageParts.length === 0
        ? 1
        : messageSettings.numberOfLines;
}

export function useInitChatEventObserver(initData: InitData): void {
    const dispatch = useDispatch();
    const settings = useSettings();
    const debugInfoStore = useDebugInfoStore();
    const chatEventObserver = useContext(ChatEventObserverContext);
    const { isPaused, isSeeking } = useVideoPlayerState();
    const store = useStore<RootState>();
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
        chatEventObserver.start();

        return (): void => {
            runInAction(() => {
                chatEventObserver.stop();
                chatEventObserver.reset();
                dispatch(chatEvents.actions.reset());
                debugInfoStore.reset();
            });
        };
    }, [chatEventObserver, dispatch, debugInfoStore]);
}
