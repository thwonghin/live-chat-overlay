import { type PropsWithChildren, createContext, useContext } from 'react';

import { type SettingsModel } from '@/models/settings';
import { rootStore } from '@/stores';

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
const SettingsContext = createContext<SettingsModel>({} as any);

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <SettingsContext.Provider value={rootStore.settingsStore.settings}>
            {children}
        </SettingsContext.Provider>
    );
};
