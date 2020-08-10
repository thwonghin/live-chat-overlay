export type AuthorDisplayMethod = 'avatar-only' | 'name-only' | 'all' | 'none';

export interface MessageSettings {
    color: string;
    weight: number;
    opacity: number;
    bgColor: string;
    strokeColor: string;
    strokeWidth: number;
    numberOfLines: number;
    authorDisplay: AuthorDisplayMethod;
}

export type MessageSettingsKey =
    | 'moderator'
    | 'member'
    | 'guest'
    | 'owner'
    | 'you'
    | 'verified'
    | 'membership'
    | 'super-chat';

export interface Settings {
    isEnabled: boolean;
    totalNumberOfLines: number;
    flowTimeInSec: number;
    messageSettings: Record<MessageSettingsKey, MessageSettings>;
}
