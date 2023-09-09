import type { RootStore } from '@/stores';
import { JSXElement, createContext, useContext } from 'solid-js';

const StoreContext = createContext<RootStore>();

export const useStore = (): RootStore => {
    const store = useContext(StoreContext);
    if (!store) {
        throw new Error('useStore must be used within a StoreProvider');
    }

    return store;
};

type Props = {
    store: RootStore;
    children: JSXElement;
};

export const StoreProvider = (props: Props) => {
    return (
        <StoreContext.Provider value={props.store}>
            {props.children}
        </StoreContext.Provider>
    );
};
