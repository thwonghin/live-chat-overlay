import { browser } from 'webextension-polyfill-ts';
import { defaultsDeep } from 'lodash-es';

import { catchWithFallback, EventEmitter } from '@/utils';
import type { Settings, MessageSettings, AuthorDisplayMethod } from './types';

export * from './types';

const SETTINGS_STORAGE_KEY = 'live-chat-overlay-settings';

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

    static async init(): Promise<void> {
        const storedSettings = await catchWithFallback(async () => {
            const result = await browser.storage.local.get(
                SETTINGS_STORAGE_KEY,
            );
            return result[SETTINGS_STORAGE_KEY] as Settings;
        }, defaultSettings);

        this.currentSettings = defaultsDeep(
            storedSettings,
            defaultSettings,
        ) as Settings;

        // Migration: set unsettable super chat bg color to empty string
        this.currentSettings.messageSettings['super-chat'].bgColor = '';

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
        browser.storage.local.set({
            [SETTINGS_STORAGE_KEY]: value,
        });
        eventEmitter.trigger('change', value);
    }

    static on: typeof eventEmitter['on'] = (...args) =>
        eventEmitter.on(...args);

    static off: typeof eventEmitter['off'] = (...args) =>
        eventEmitter.off(...args);
}
