import * as React from 'react';

import type { Browser, I18n } from 'webextension-polyfill-ts';

export const I18nContext = React.createContext<I18n.Static>({} as I18n.Static);

export function useI18n(): I18n.Static {
    return React.useContext(I18nContext);
}

type Props = {
    browser: Browser;
    children: React.ReactNode;
};

export const I18nProvider: React.FC<Props> = ({ browser, children }) => {
    return (
        <I18nContext.Provider value={browser.i18n}>
            {children}
        </I18nContext.Provider>
    );
};
