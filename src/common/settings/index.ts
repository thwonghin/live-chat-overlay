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
    numberOfLines: 15,
    flowTimeInSec: 10,
    messageSettings: {
        guest: commonMsgSettings,
        member: {
            ...commonMsgSettings,
            color: '#2ba640',
            authorDisplay: 'avatar-only',
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

export const settingsStorage = {
    get(): Settings {
        return defaultSettings;
    },
};
