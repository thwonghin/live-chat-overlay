export interface Thumbnail {
    url: string;
    width: number;
    height: number;
}

export interface TextPart {
    text: string;
}

export interface EmojiPart {
    id: string;
    thumbnails: Thumbnail[];
    shortcuts: string[];
}

export type MessagePart = TextPart | EmojiPart;

export interface NormalChatItem {
    id: string;
    messageParts: MessagePart[];
    avatars: Thumbnail[];
    timestampInUs: number;
    videoTimestampInMs?: number;
    authorName: string;
    authorBadges: string[];
    authorType: 'moderator' | 'member' | 'guest' | 'owner' | 'you' | 'verified';
    chatType: 'normal';
}

export type SuperChatItem = Omit<
    NormalChatItem,
    'authorType' | 'chatType' | 'authorBadges'
> & {
    donationAmount: string;
    color: string;
    chatType: 'super-chat';
};

export type SuperStickerItem = Omit<
    SuperChatItem,
    'chatType' | 'messageParts'
> & {
    stickers: Thumbnail[];
    chatType: 'super-sticker';
};

export type MembershipItem = Omit<NormalChatItem, 'authorType' | 'chatType'> & {
    chatType: 'membership';
};

export type ChatItem =
    | NormalChatItem
    | SuperChatItem
    | SuperStickerItem
    | MembershipItem;
