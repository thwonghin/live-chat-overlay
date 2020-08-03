export interface MessageSettings {
    color: string;
    weight: number;
    opacity: number;
    bgColor: string;
    strokeColor: string;
    strokeWidth: number;
    numberOfLines: number;
    authorDisplay: 'avatar-only' | 'name-only' | 'all' | 'none';
}

type MessageSettingsKeys =
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
    messageSettings: Record<MessageSettingsKeys, MessageSettings>;
}
