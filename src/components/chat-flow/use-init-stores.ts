import { useEffect } from 'react';

import { useStore } from '@/contexts/root-store';
import type { InitData } from '@/definitions/youtube';

export function useInitStores(initData: InitData): void {
    const { chatItemStore } = useStore();

    useEffect(() => {
        // Need to init here because it needs to determine the width
        // that depends on React

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        chatItemStore.importInitData(initData);
    }, [initData, chatItemStore]);
}
