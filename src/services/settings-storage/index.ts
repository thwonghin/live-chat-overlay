import { defaultsDeep } from 'lodash-es';
import type { Browser } from 'webextension-polyfill-ts';

import { catchWithFallback, EventEmitter, promiseSeries } from '@/utils';

import { SETTINGS_STORAGE_KEY, MIGRATIONS_STORAGE_KEY } from './const';
import { migrations } from './migrations';
import type { Settings, MessageSettings, AuthorDisplayMethod } from './types';

export * from './types';

export const authorDisplayMethods: AuthorDisplayMethod[] = [
    'avatar-only',
    'name-only',
    'all',
    'none',
];

const commonMessageSettings: MessageSettings = {
    color: 'white',
    weight: 700,
    opacity: 0.8,
    bgColor: 'transparent',
    strokeColor: 'black',
    strokeWidth: 0.03,
    numberOfLines: 1,
    authorDisplay: 'none',
    isSticky: false,
};

const defaultSettings: Settings = {
    isEnabled: true,
    totalNumberOfLines: 15,
    flowTimeInSec: 10,
    globalOpacity: 0.7,
    messageSettings: {
        guest: commonMessageSettings,
        member: {
            ...commonMessageSettings,
            color: '#2ba640',
        },
        you: commonMessageSettings,
        moderator: {
            ...commonMessageSettings,
            color: '#5e84f1',
            authorDisplay: 'all',
        },
        owner: {
            ...commonMessageSettings,
            color: 'white',
            bgColor: '#ffd600',
            authorDisplay: 'all',
        },
        verified: {
            ...commonMessageSettings,
            color: '#E9E9E9',
            bgColor: '#606060',
            authorDisplay: 'all',
        },
        membership: {
            ...commonMessageSettings,
            bgColor: '#2ba640',
            numberOfLines: 1,
            authorDisplay: 'all',
        },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'super-chat': {
            ...commonMessageSettings,
            numberOfLines: 2,
            authorDisplay: 'all',
            bgColor: '',
        },
        pinned: {
            ...commonMessageSettings,
            numberOfLines: 1,
            authorDisplay: 'all',
            bgColor: '#224072',
            isSticky: true,
        },
    },
};

type EventMap = {
    change: Settings;
};

const eventEmitter = new EventEmitter<EventMap>();

let isInitiated = false;
let currentSettings: Settings;
let browser: Browser;

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

function assertInitiated(): void {
    if (!isInitiated) {
        throw new Error('Storage is not init!');
    }
}

async function init(inputBrowser: Browser): Promise<void> {
    browser = inputBrowser;
    try {
        await runMigrations();
    } catch (error) {
        console.error(
            'Fail to run migration, fallback to default settings...',
            error,
        );
    }

    const storedSettings = await catchWithFallback(async () => {
        const result = await browser.storage.sync.get(SETTINGS_STORAGE_KEY);
        return result[SETTINGS_STORAGE_KEY] as Settings;
    }, defaultSettings);

    currentSettings = defaultsDeep(storedSettings, defaultSettings) as Settings;

    isInitiated = true;
}

const storageInstance = {
    init,
    get settings(): Settings {
        assertInitiated();
        return currentSettings;
    },

    set settings(value: Settings) {
        assertInitiated();
        currentSettings = value;

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        browser.storage.sync.set({
            [SETTINGS_STORAGE_KEY]: value,
        });
        eventEmitter.trigger('change', value);
    },

    on: eventEmitter.on.bind(eventEmitter),
    off: eventEmitter.off.bind(eventEmitter),
};

export { storageInstance };
