import { useEffect } from 'react';

import { runInAction } from 'mobx';

import { useStore } from '@/contexts/root-store';
import type { InitData } from '@/definitions/youtube';
import { useVideoPlayerState } from '@/hooks';

import { useVideoPlayerRect } from './use-video-player-rect';

function useResetChatEventsOnPlayerRectChange(): void {
    const { chatItemStore } = useStore();
    const rect = useVideoPlayerRect();

    useEffect(() => {
        chatItemStore.resetNonStickyChatItems();
    }, [rect.width, rect.height, chatItemStore]);
}

export function useInitChatItemStore(initData: InitData): void {
    const { debugInfoStore, chatItemStore } = useStore();
    const { isPaused, isSeeking } = useVideoPlayerState();

    useResetChatEventsOnPlayerRectChange();

    useEffect(() => {
        if (isPaused) {
            chatItemStore.pause();
        } else {
            chatItemStore.resume();
        }
    }, [isPaused, chatItemStore]);

    useEffect(() => {
        if (isSeeking) {
            chatItemStore.reset();
        }
    }, [isSeeking, chatItemStore]);

    useEffect(() => {
        // Need to init here because it needs to determine the width
        // that depends on React

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        chatItemStore.importInitData(initData);
    }, [initData, chatItemStore]);

    useEffect(() => {
        chatItemStore.start();

        return (): void => {
            runInAction(() => {
                chatItemStore.stop();
                chatItemStore.reset();
                debugInfoStore.reset();
            });
        };
    }, [chatItemStore, debugInfoStore]);
}
