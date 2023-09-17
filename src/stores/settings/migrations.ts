import Color from 'color';
import { type Browser } from 'webextension-polyfill';

import { logInfo } from '@/utils/logger';

import { SETTINGS_STORAGE_KEY } from './const';
import type { MessageSettingsKey, Settings } from '../../models/settings/types';

export const migrations: Array<{
    name: string;
    run: (browser: Browser) => Promise<void>;
}> = [
    {
        name: 'MigrateLocalStorageToSyncStorage',
        async run(browser: Browser): Promise<void> {
            const localStorageResult = await browser.storage.local.get(
                SETTINGS_STORAGE_KEY,
            );
            const localSettings = localStorageResult?.[SETTINGS_STORAGE_KEY] as
                | Settings
                | undefined;
            if (!localSettings) {
                return;
            }

            const syncStorageResult = await browser.storage.sync.get(
                SETTINGS_STORAGE_KEY,
            );
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
    {
        name: 'MigrateColorsToHexCode',
        async run(browser: Browser): Promise<void> {
            const syncStorageResult = await browser.storage.sync.get(
                SETTINGS_STORAGE_KEY,
            );
            const syncSettings = syncStorageResult?.[SETTINGS_STORAGE_KEY] as
                | Settings
                | undefined;

            if (!syncSettings) {
                return;
            }

            function convertHex(value: string) {
                try {
                    // eslint-disable-next-line new-cap
                    return Color(value).hex();
                } catch (e) {
                    logInfo('Failed to convert color to hex:', value);
                    return '#FFFFFF';
                }
            }

            Object.keys(syncSettings.messageSettings).forEach((key) => {
                const msgSetting =
                    syncSettings.messageSettings[key as MessageSettingsKey];
                msgSetting.bgColor = convertHex(msgSetting.bgColor);
                msgSetting.color = convertHex(msgSetting.bgColor);
                msgSetting.strokeColor = convertHex(msgSetting.strokeColor);
            });
        },
    },
];
