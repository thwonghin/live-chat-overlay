import { type PropsWithChildren, createContext, useContext } from 'react';

import { rootStore } from '@/stores';
import type { RootStore } from '@/stores';

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
const StoreContext = createContext<RootStore>({} as any);

export const useStore = () => useContext(StoreContext);

export const StoreProvider: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <StoreContext.Provider value={rootStore}>
            {children}
        </StoreContext.Provider>
    );
};
