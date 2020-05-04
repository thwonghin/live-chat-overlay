export interface MessageSettings {
    color: string;
    weight: number;
    opacity: number;
    bgColor: string;
    strokeColor: string;
    strokeWidth: number;
}

type MessageSettingsKeys =
    | 'moderator'
    | 'member'
    | 'guest'
    | 'owner'
    | 'you'
    | 'membership';

export interface Settings {
    numberOfLines: number;
    flowTimeInSec: number;
    messageSettings: Record<MessageSettingsKeys, MessageSettings>;
}
