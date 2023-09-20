import { createEffect, createRoot } from 'solid-js';
import { type SetStoreFunction, createStore } from 'solid-js/store';
import { type Browser } from 'webextension-polyfill';

import {
    type Settings,
    type SettingsModel,
    createSettingsModel,
} from '@/models/settings';
import { catchWithFallback, promiseSeries } from '@/utils';

import { MIGRATIONS_STORAGE_KEY, SETTINGS_STORAGE_KEY } from './const';
import { migrations } from './migrations';

export type SettingsStore = Readonly<{
    settings: SettingsModel;
    setSettings: SetStoreFunction<SettingsModel>;
    cleanup?: () => void;
}>;

export const createSettingsStore = async (
    browser: Browser,
): Promise<SettingsStore> => {
    async function runMigrations() {
        const result = await browser.storage.sync.get(MIGRATIONS_STORAGE_KEY);
        const currentMigrations = (result[MIGRATIONS_STORAGE_KEY] ??
            []) as string[];

        const missingMigrations = migrations.filter(
            (migration) => !currentMigrations.includes(migration.name),
        );

        await promiseSeries(
            missingMigrations.map((migration) => async () => {
                await migration.run(browser);

                const getResult = await browser.storage.sync.get(
                    MIGRATIONS_STORAGE_KEY,
                );
                const migrated = (getResult[MIGRATIONS_STORAGE_KEY] ??
                    []) as string[];

                await browser.storage.sync.set({
                    [MIGRATIONS_STORAGE_KEY]: [...migrated, migration.name],
                });
            }),
        );
    }

    await runMigrations();

    async function loadFromStorage() {
        const storedSettings = await catchWithFallback(async () => {
            const result = await browser.storage.sync.get(SETTINGS_STORAGE_KEY);
            return result[SETTINGS_STORAGE_KEY] as Settings;
        }, undefined);

        const settings = createSettingsModel();

        if (storedSettings) {
            return settings.setRawSettings(storedSettings);
        }

        return settings;
    }

    const [state, setState] = createStore<SettingsModel>(
        await loadFromStorage(),
    );

    async function updateSettingsInStorage(settings: SettingsModel) {
        return browser.storage.sync.set({
            [SETTINGS_STORAGE_KEY]: settings,
        });
    }

    let cleanup: (() => void) | undefined;
    createRoot((dispose) => {
        createEffect(() => {
            void updateSettingsInStorage(state);
        });

        cleanup = dispose;
    });

    return {
        settings: state,
        setSettings: setState,
        cleanup,
    };
};
