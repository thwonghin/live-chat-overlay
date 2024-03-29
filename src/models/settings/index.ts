import {
    isMembershipItem,
    isNormalChatItem,
    isPinnedItem,
    isSuperChatItem,
    isSuperStickerItem,
} from '@/models/chat-item/mapper';
import type { ChatItem } from '@/models/chat-item/types';
import { assertNever, defaultsDeep } from '@/utils';

import {
    type Settings,
    type MessageSettings,
    AuthorDisplayMethod,
    FontScaleMethod,
} from './types';

export * from './types';

const commonMessageSettings: Readonly<MessageSettings> = Object.freeze({
    color: 'white',
    weight: 700,
    opacity: 0.8,
    bgColor: 'transparent',
    strokeColor: 'black',
    strokeWidth: 0.03,
    numberOfLines: 1,
    authorDisplay: AuthorDisplayMethod.NONE,
    isSticky: false,
} as const);

export const defaultSettings: Readonly<Settings> = Object.freeze({
    isEnabled: true,
    flowTimeInSec: 10,
    totalNumberOfLines: 15,
    globalOpacity: 0.7,
    fontSizeFixed: 20,
    fontSizeScaled: 6.67,
    fontScaleMethod: FontScaleMethod.SCALED,
    messagePosition: {
        top: 0,
        bottom: 100,
        left: 0,
        right: 100,
        mode: 'ratio',
    },
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
            authorDisplay: AuthorDisplayMethod.ALL,
        },
        owner: {
            ...commonMessageSettings,
            color: 'white',
            bgColor: '#ffd600',
            authorDisplay: AuthorDisplayMethod.ALL,
        },
        verified: {
            ...commonMessageSettings,
            color: '#E9E9E9',
            bgColor: '#606060',
            authorDisplay: AuthorDisplayMethod.ALL,
        },
        membership: {
            ...commonMessageSettings,
            bgColor: '#2ba640',
            numberOfLines: 1,
            authorDisplay: AuthorDisplayMethod.ALL,
        },
        'super-chat': {
            ...commonMessageSettings,
            numberOfLines: 2,
            authorDisplay: AuthorDisplayMethod.ALL,
            bgColor: '',
        },
        pinned: {
            ...commonMessageSettings,
            numberOfLines: 1,
            authorDisplay: AuthorDisplayMethod.ALL,
            bgColor: '#224072',
            isSticky: true,
        },
    },
} as const);

export type SettingsModel = {
    setRawSettings(settings: Settings): SettingsModel;
    getMessageSettings(chatItem: ChatItem): MessageSettings;
} & Settings;

export const createSettingsModel = (): SettingsModel => {
    const settingsModel: SettingsModel = {
        ...defaultSettings,
        setRawSettings(settings: Settings) {
            Object.assign(settingsModel, defaultsDeep(settings, { ...this }));
            return settingsModel;
        },
        getMessageSettings(chatItem: ChatItem): MessageSettings {
            const { messageSettings } = settingsModel;
            if (isNormalChatItem(chatItem)) {
                return messageSettings[chatItem.authorType];
            }

            if (isMembershipItem(chatItem)) {
                return messageSettings.membership;
            }

            if (isSuperChatItem(chatItem) || isSuperStickerItem(chatItem)) {
                return messageSettings['super-chat'];
            }

            if (isPinnedItem(chatItem)) {
                return messageSettings.pinned;
            }

            return assertNever(chatItem);
        },
    };

    return settingsModel;
};
