import { type Browser } from 'webextension-polyfill';

import {
    type Settings,
    SettingsModel,
    createSettingsModel,
} from '@/models/settings';
import { catchWithFallback, promiseSeries } from '@/utils';

import { MIGRATIONS_STORAGE_KEY, SETTINGS_STORAGE_KEY } from './const';
import { migrations } from './migrations';
import { SetStoreFunction, createStore, produce } from 'solid-js/store';
import { createEffect, createRoot } from 'solid-js';

export type SettingsStoreValue = {
    settings: SettingsModel;
};

export type SettingsStore = {
    setSettings: SetStoreFunction<SettingsStoreValue>;
    cleanup?: () => void;
} & SettingsStoreValue;

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

    const [state, setState] = createStore<SettingsStoreValue>({
        settings: await loadFromStorage(),
    });

    async function updateSettingsInStorage(settings: SettingsModel) {
        return browser.storage.sync.set({
            [SETTINGS_STORAGE_KEY]: settings,
        });
    }

    const wrappedSetState: typeof setState = (...args: any[]) => {
        // Super hacky workaround to tame the typescript compiler
        setState.apply(null, args as never);
        updateSettingsInStorage(state.settings);
    };

    let cleanup: (() => void) | undefined = undefined;

    createRoot((dispose) => {
        createEffect(() => {
            updateSettingsInStorage(state.settings);
        });
        cleanup = dispose;
    });

    return {
        ...state,
        setSettings: wrappedSetState,
        cleanup,
    };
};
