import { useEffect } from 'react';

import { runInAction } from 'mobx';

import { useStore } from '@/contexts/root-store';
import type { InitData } from '@/definitions/youtube';

export function useInitStores(initData: InitData): void {
    const { debugInfoStore, chatItemStore, uiStore } = useStore();

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

    useEffect(() => {
        uiStore.startListening();

        return () => {
            uiStore.stopListening();
        };
    }, [uiStore]);
}
