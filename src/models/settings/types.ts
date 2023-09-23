export enum AuthorDisplayMethod {
    AVATAR_ONLY = 'avatar-only',
    NAME_ONLY = 'name-only',
    ALL = 'all',
    NONE = 'none',
}

export enum FontScaleMethod {
    FIXED = 'fixed',
    SCALED = 'scaled',
}

export type MessageSettings = {
    color: string;
    weight: number;
    opacity: number;
    bgColor: string;
    strokeColor: string;
    strokeWidth: number;
    numberOfLines: number;
    authorDisplay: AuthorDisplayMethod;
    isSticky: boolean;
};

export const messageSettingsKeys = [
    'moderator',
    'member',
    'guest',
    'owner',
    'you',
    'verified',
    'membership',
    'super-chat',
    'pinned',
] as const;

export type MessageSettingsKey = (typeof messageSettingsKeys)[number];

export type Settings = {
    isEnabled: boolean;
    totalNumberOfLines: number;
    flowTimeInSec: number;
    globalOpacity: number;
    messageSettings: Record<MessageSettingsKey, MessageSettings>;
    fontSizeFixed: number;
    fontSizeScaled: number;
    fontScaleMethod: FontScaleMethod;
};
