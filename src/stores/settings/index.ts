import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { type Browser } from 'webextension-polyfill';

import { type Settings, SettingsModel } from '@/models/settings';
import { catchWithFallback, promiseSeries } from '@/utils';

import { MIGRATIONS_STORAGE_KEY, SETTINGS_STORAGE_KEY } from './const';
import { migrations } from './migrations';

class SettingsStore {
    settings: SettingsModel;

    constructor(public browser: Browser) {
        this.settings = new SettingsModel();
        reaction(
            () => this.settings,
            async () => {
                await this.updateSettingsInStorage();
            },
        );
        makeAutoObservable(this);
    }

    async init() {
        try {
            await this.runMigrations();
        } catch (error) {
            console.error(
                'Fail to run migration, fallback to default settings...',
                error,
            );
        }

        await this.loadFromStorage();
    }

    private async runMigrations() {
        const result = await this.browser.storage.sync.get(
            MIGRATIONS_STORAGE_KEY,
        );
        const currentMigrations = (result[MIGRATIONS_STORAGE_KEY] ??
            []) as string[];

        const missingMigrations = migrations.filter(
            (migration) => !currentMigrations.includes(migration.name),
        );

        await promiseSeries(
            missingMigrations.map((migration) => async () => {
                await migration.run(this.browser);

                const getResult = await this.browser.storage.sync.get(
                    MIGRATIONS_STORAGE_KEY,
                );
                const migrated = (getResult[MIGRATIONS_STORAGE_KEY] ??
                    []) as string[];

                await this.browser.storage.sync.set({
                    [MIGRATIONS_STORAGE_KEY]: [...migrated, migration.name],
                });
            }),
        );
    }

    private async loadFromStorage() {
        const storedSettings = await catchWithFallback(async () => {
            const result = await this.browser.storage.sync.get(
                SETTINGS_STORAGE_KEY,
            );
            return result[SETTINGS_STORAGE_KEY] as Settings;
        }, undefined);

        if (storedSettings) {
            runInAction(() => {
                this.settings.setRawSettings(storedSettings);
            });
        }
    }

    private async updateSettingsInStorage() {
        return this.browser.storage.sync.set({
            [SETTINGS_STORAGE_KEY]: this.settings,
        });
    }
}

export { SettingsStore };
