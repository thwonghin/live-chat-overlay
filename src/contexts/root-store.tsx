import { type PropsWithChildren, createContext, useContext } from 'react';

import type { RootStore } from '@/stores';

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
const StoreContext = createContext<RootStore>({} as any);

export const useStore = () => useContext(StoreContext);

type Props = {
    store: RootStore;
};

export const StoreProvider: React.FC<PropsWithChildren<Props>> = ({
    store,
    children,
}) => {
    return (
        <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    );
};
