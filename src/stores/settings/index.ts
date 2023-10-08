import { noop } from 'lodash-es';
import { createEffect, createRoot } from 'solid-js';
import { type SetStoreFunction, createStore } from 'solid-js/store';

import {
    type Settings,
    type SettingsModel,
    createSettingsModel,
} from '@/models/settings';
import { catchWithFallback, promiseSeries } from '@/utils';

import { MIGRATIONS_STORAGE_KEY, SETTINGS_STORAGE_KEY } from './const';
import { migrations } from './migrations';

async function runMigrations() {
    const result = await chrome.storage.sync.get(MIGRATIONS_STORAGE_KEY);
    const currentMigrations = (result[MIGRATIONS_STORAGE_KEY] ??
        []) as string[];

    const missingMigrations = migrations.filter(
        (migration) => !currentMigrations.includes(migration.name),
    );

    await promiseSeries(
        missingMigrations.map((migration) => async () => {
            await migration.run();

            const getResult = await chrome.storage.sync.get(
                MIGRATIONS_STORAGE_KEY,
            );
            const migrated = (getResult[MIGRATIONS_STORAGE_KEY] ??
                []) as string[];

            await chrome.storage.sync.set({
                [MIGRATIONS_STORAGE_KEY]: [...migrated, migration.name],
            });
        }),
    );
}

async function loadFromStorage() {
    const storedSettings = await catchWithFallback(async () => {
        const result = await chrome.storage.sync.get(SETTINGS_STORAGE_KEY);
        return result[SETTINGS_STORAGE_KEY] as Settings;
    }, undefined);

    const settings = createSettingsModel();

    if (storedSettings) {
        return settings.setRawSettings(storedSettings);
    }

    return settings;
}

export class SettingsStore {
    settings: SettingsModel;
    setSettings: SetStoreFunction<SettingsModel>;
    cleanup = noop;

    constructor() {
        const [state, setState] = createStore<SettingsModel>(
            createSettingsModel(),
        );
        // eslint-disable-next-line solid/reactivity
        this.settings = state;
        this.setSettings = setState;
    }

    async init() {
        await runMigrations();
        this.setSettings(await loadFromStorage());
        this.attachReactiveContext();
    }

    async updateSettingsInStorage(settings: SettingsModel) {
        return chrome.storage.sync.set({
            [SETTINGS_STORAGE_KEY]: settings,
        });
    }

    private attachReactiveContext() {
        createRoot((dispose) => {
            createEffect(() => {
                void this.updateSettingsInStorage(this.settings);
            });

            this.cleanup = dispose;
        });
    }
}
