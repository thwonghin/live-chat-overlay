import { Settings, MessageSettings } from './types';

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
    numberOfLines: 15,
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
    static currentSettings = defaultSettings;

    static listeners: Listener[] = [];

    static get settings(): Settings {
        return this.currentSettings;
    }

    static set settings(value: Settings) {
        this.currentSettings = value;
        this.listeners.forEach((listener) => listener(this.currentSettings));
    }

    static addEventListener(event: 'change', listener: Listener): void {
        this.listeners.push(listener);
    }

    static removeEventListener(event: 'change', listener: Listener): void {
        const index = this.listeners.indexOf(listener);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }
}
