import { Settings, MessageSettings } from './types';

const commonMsgSettings: MessageSettings = {
    color: 'white',
    weight: 700,
    opacity: 0.8,
    bgColor: 'transparent',
    strokeColor: 'black',
    strokeWidth: 0.03,
};

const defaultSettings: Settings = {
    numberOfLines: 15,
    flowTimeInSec: 10,
    messageSettings: {
        guest: commonMsgSettings,
        member: {
            ...commonMsgSettings,
            color: 'rgb(15,157,88)',
        },
        you: commonMsgSettings,
        moderator: commonMsgSettings,
        owner: commonMsgSettings,
        membership: commonMsgSettings,
    },
};

export const settingsStorage = {
    get(): Settings {
        return defaultSettings;
    },
};
