import { browser } from 'webextension-polyfill-ts';
import { defaultsDeep } from 'lodash-es';

import { catchWithFallback, EventEmitter, promiseSeries } from '@/utils';
import type { Settings, MessageSettings, AuthorDisplayMethod } from './types';
import { migrations } from './migrations';
import { SETTINGS_STORAGE_KEY, MIGRATIONS_STORAGE_KEY } from './const';

export * from './types';

export const authorDisplayMethods: AuthorDisplayMethod[] = [
    'avatar-only',
    'name-only',
    'all',
    'none',
];

const commonMsgSettings: MessageSettings = {
    color: 'white',
    weight: 700,
    opacity: 0.8,
    bgColor: 'transparent',
    strokeColor: 'black',
    strokeWidth: 0.03,
    numberOfLines: 1,
    authorDisplay: 'none',
};

const defaultSettings: Settings = {
    isEnabled: true,
    totalNumberOfLines: 15,
    flowTimeInSec: 10,
    globalOpacity: 0.7,
    messageSettings: {
        guest: commonMsgSettings,
        member: {
            ...commonMsgSettings,
            color: '#2ba640',
        },
        you: commonMsgSettings,
        moderator: {
            ...commonMsgSettings,
            color: '#5e84f1',
            authorDisplay: 'all',
        },
        owner: {
            ...commonMsgSettings,
            color: 'white',
            bgColor: '#ffd600',
            authorDisplay: 'all',
        },
        verified: {
            ...commonMsgSettings,
            color: '#E9E9E9',
            bgColor: '#606060',
            authorDisplay: 'all',
        },
        membership: {
            ...commonMsgSettings,
            bgColor: '#2ba640',
            numberOfLines: 1,
            authorDisplay: 'all',
        },
        'super-chat': {
            ...commonMsgSettings,
            numberOfLines: 2,
            authorDisplay: 'all',
            bgColor: '',
        },
    },
};

type EventMap = {
    change: Settings;
};

const eventEmitter = new EventEmitter<EventMap>();

export class StorageInstance {
    static isInitiated = false;

    static currentSettings: Settings;

    static async runMigrations(): Promise<void> {
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

    static async init(): Promise<void> {
        try {
            await StorageInstance.runMigrations();
        } catch (error: unknown) {
            // eslint-disable-next-line no-console
            console.error(
                'Fail to run migration, fallback to default settings...',
                error,
            );
        }

        const storedSettings = await catchWithFallback(async () => {
            const result = await browser.storage.sync.get(SETTINGS_STORAGE_KEY);
            return result[SETTINGS_STORAGE_KEY] as Settings;
        }, defaultSettings);

        this.currentSettings = defaultsDeep(
            storedSettings,
            defaultSettings,
        ) as Settings;

        this.isInitiated = true;
    }

    static assertInitiated(): void {
        if (!StorageInstance.isInitiated) {
            throw new Error('Storage is not init!');
        }
    }

    static get settings(): Settings {
        this.assertInitiated();
        return this.currentSettings;
    }

    static set settings(value: Settings) {
        this.assertInitiated();
        this.currentSettings = value;

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        browser.storage.sync.set({
            [SETTINGS_STORAGE_KEY]: value,
        });
        eventEmitter.trigger('change', value);
    }

    static on: typeof eventEmitter['on'] = (...args) =>
        eventEmitter.on(...args);

    static off: typeof eventEmitter['off'] = (...args) =>
        eventEmitter.off(...args);
}
