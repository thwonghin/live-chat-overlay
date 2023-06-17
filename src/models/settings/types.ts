/* eslint-disable @typescript-eslint/naming-convention */
export enum AuthorDisplayMethod {
    AVATAR_ONLY = 'avatar-only',
    NAME_ONLY = 'name-only',
    ALL = 'all',
    NONE = 'none',
}
/* eslint-enable @typescript-eslint/naming-convention */

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

export type MessageSettingsKey =
    | 'moderator'
    | 'member'
    | 'guest'
    | 'owner'
    | 'you'
    | 'verified'
    | 'membership'
    | 'super-chat'
    | 'pinned';

export type Settings = {
    isEnabled: boolean;
    totalNumberOfLines: number;
    flowTimeInSec: number;
    globalOpacity: number;
    messageSettings: Record<MessageSettingsKey, MessageSettings>;
};
