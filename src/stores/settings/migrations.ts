import { SETTINGS_STORAGE_KEY } from './const';
import type { Settings } from '../../models/settings/types';

export const migrations: Array<{
    name: string;
    run: () => Promise<void>;
}> = [
    {
        name: 'MigrateLocalStorageToSyncStorage',
        async run(): Promise<void> {
            const localStorageResult =
                await chrome.storage.local.get(SETTINGS_STORAGE_KEY);
            const localSettings = localStorageResult?.[SETTINGS_STORAGE_KEY] as
                | Settings
                | undefined;
            if (!localSettings) {
                return;
            }

            const syncStorageResult =
                await chrome.storage.sync.get(SETTINGS_STORAGE_KEY);
            const syncSettings = syncStorageResult?.[SETTINGS_STORAGE_KEY] as
                | Settings
                | undefined;

            // Avoid overriding sync settings
            if (!syncSettings) {
                await chrome.storage.sync.set({
                    [SETTINGS_STORAGE_KEY]: localSettings,
                });
            }

            await chrome.storage.local.clear();
        },
    },
];
