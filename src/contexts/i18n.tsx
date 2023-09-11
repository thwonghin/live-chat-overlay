import {
    type JSXElement,
    createContext,
    useContext,
    type Component,
} from 'solid-js';
import type { Browser, I18n } from 'webextension-polyfill';

export const I18nContext = createContext<I18n.Static>();

export function useI18n(): I18n.Static {
    const i18n = useContext(I18nContext);
    if (!i18n) {
        throw new Error('useI18n must be used within a I18nProvider');
    }

    return i18n;
}

type Props = Readonly<{
    browser: Browser;
    children: JSXElement;
}>;

export const I18nProvider: Component<Props> = (props) => {
    return (
        // eslint-disable-next-line solid/reactivity
        <I18nContext.Provider value={props.browser.i18n}>
            {props.children}
        </I18nContext.Provider>
    );
};
