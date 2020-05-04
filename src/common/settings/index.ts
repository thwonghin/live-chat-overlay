import { Settings, MessageSettings } from './types';

const commonMsgSettings: MessageSettings = {
    color: 'white',
    weight: 700,
    opacity: 0.8,
    bgColor: 'transparent',
    strokeColor: 'black',
    strokeWidth: 0.03,
    numberOfLines: 1,
};

const defaultSettings: Settings = {
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
        },
        owner: {
            ...commonMsgSettings,
            color: 'white',
            bgColor: '#ffd600',
        },
        verified: {
            ...commonMsgSettings,
            color: '#E9E9E9',
            bgColor: '#606060',
        },
        membership: {
            ...commonMsgSettings,
            numberOfLines: 1,
        },
        'super-chat': {
            ...commonMsgSettings,
            numberOfLines: 2,
        },
    },
};

export const settingsStorage = {
    get(): Settings {
        return defaultSettings;
    },
};
