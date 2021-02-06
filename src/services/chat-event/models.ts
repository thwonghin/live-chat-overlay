import { Except } from 'type-fest';

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
    width?: number;
    messageParts: MessagePart[];
    avatars: Thumbnail[];
    videoTimestampInMs: number;
    authorName: string;
    authorBadges: string[];
    authorType: 'moderator' | 'member' | 'guest' | 'owner' | 'you' | 'verified';
    chatType: 'normal';
}

export type SuperChatItem = Except<
    NormalChatItem,
    'authorType' | 'chatType' | 'authorBadges'
> & {
    donationAmount: string;
    color: string;
    chatType: 'super-chat';
};

export type SuperStickerItem = Except<
    SuperChatItem,
    'chatType' | 'messageParts'
> & {
    stickers: Thumbnail[];
    chatType: 'super-sticker';
};

export type MembershipItem = Except<
    NormalChatItem,
    'authorType' | 'chatType'
> & {
    chatType: 'membership';
};

export type StickyItem = Except<NormalChatItem, 'chatType'> & {
    chatType: 'sticky';
};

export type ChatItem =
    | NormalChatItem
    | SuperChatItem
    | SuperStickerItem
    | MembershipItem
    | StickyItem;
