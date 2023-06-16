import { type PropsWithChildren, createContext, useContext } from 'react';

import { rootStore } from '@/stores';
import type { DebugInfoStore } from '@/stores/debug-info';

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
const DebugInfoStoreContext = createContext<DebugInfoStore>({} as any);

export const useDebugInfoStore = () => useContext(DebugInfoStoreContext);

export const DebugInfoStoreProvider: React.FC<PropsWithChildren> = ({
    children,
}) => {
    return (
        <DebugInfoStoreContext.Provider value={rootStore.debugInfoStore}>
            {children}
        </DebugInfoStoreContext.Provider>
    );
};
