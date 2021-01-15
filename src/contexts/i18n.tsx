import type { Browser, I18n } from 'webextension-polyfill-ts';
import * as React from 'react';

export const I18nContext = React.createContext<I18n.Static>({} as any);

export function useI18n(): I18n.Static {
    return React.useContext(I18nContext);
}

interface Props {
    browser: Browser;
    children: React.ReactNode;
}

export const I18nProvider: React.FC<Props> = ({ browser, children }) => {
    return (
        <I18nContext.Provider value={browser.i18n}>
            {children}
        </I18nContext.Provider>
    );
};
