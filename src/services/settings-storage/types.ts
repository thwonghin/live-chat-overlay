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
    isSticky: boolean;
}

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

export interface Settings {
    isEnabled: boolean;
    totalNumberOfLines: number;
    flowTimeInSec: number;
    globalOpacity: number;
    messageSettings: Record<MessageSettingsKey, MessageSettings>;
}
