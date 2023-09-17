import { type Browser } from 'webextension-polyfill';

import { SETTINGS_STORAGE_KEY } from './const';
import type { Settings } from '../../models/settings/types';

export const migrations: Array<{
    name: string;
    run: (browser: Browser) => Promise<void>;
}> = [
    {
        name: 'MigrateLocalStorageToSyncStorage',
        async run(browser: Browser): Promise<void> {
            const localStorageResult =
                await browser.storage.local.get(SETTINGS_STORAGE_KEY);
            const localSettings = localStorageResult?.[SETTINGS_STORAGE_KEY] as
                | Settings
                | undefined;
            if (!localSettings) {
                return;
            }

            const syncStorageResult =
                await browser.storage.sync.get(SETTINGS_STORAGE_KEY);
            const syncSettings = syncStorageResult?.[SETTINGS_STORAGE_KEY] as
                | Settings
                | undefined;

            // Avoid overriding sync settings
            if (!syncSettings) {
                await browser.storage.sync.set({
                    [SETTINGS_STORAGE_KEY]: localSettings,
                });
            }

            await browser.storage.local.clear();
        },
    },
];
