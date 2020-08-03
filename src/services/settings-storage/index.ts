import { defaultsDeep } from 'lodash-es';
import { catchWithFallback } from '@/utils';
import type { Settings, MessageSettings } from './types';

const SETTINGS_STORAGE_KEY = 'live-chat-overlay-settings';

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
        },
    },
};

type Listener = (settings: Settings) => void;

export class SettingsStorage {
    static isInitiated = false;

    static currentSettings: Settings;

    static listeners: Listener[] = [];

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
        this.isInitiated = true;
    }

    static assertInitiated(): void {
        if (!SettingsStorage.isInitiated) {
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
        this.listeners.forEach((listener) => listener(value));
    }

    static addEventListener(event: 'change', listener: Listener): void {
        this.assertInitiated();
        this.listeners.push(listener);
    }

    static removeEventListener(event: 'change', listener: Listener): void {
        this.assertInitiated();
        const index = this.listeners.indexOf(listener);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }
}
