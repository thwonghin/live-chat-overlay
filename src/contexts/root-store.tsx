import {
    type JSXElement,
    createContext,
    useContext,
    type Component,
} from 'solid-js';

import type { RootStore } from '@/stores';
import { createError } from '@/utils/logger';

const StoreContext = createContext<RootStore>();

export const useStore = (): RootStore => {
    const store = useContext(StoreContext);
    if (!store) {
        throw createError('useStore must be used within a StoreProvider');
    }

    return store;
};

type Props = {
    store: RootStore;
    children: JSXElement;
};

export const StoreProvider: Component<Props> = (props) => {
    return (
        // eslint-disable-next-line solid/reactivity
        <StoreContext.Provider value={props.store}>
            {props.children}
        </StoreContext.Provider>
    );
};
