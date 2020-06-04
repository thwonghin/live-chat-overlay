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
    timestamp: string;
    authorName: string;
    authorBadges: string[];
    authorType: 'moderator' | 'member' | 'guest' | 'owner' | 'you' | 'verified';
    chatType: 'normal';
}

export type SuperChatItem = Omit<NormalChatItem, 'authorType' | 'chatType'> & {
    donationAmount: string;
    color: string;
    chatType: 'super-chat';
};

export type SuperStickerItem = Omit<SuperChatItem, 'chatType'> & {
    stickerUrl: string;
    chatType: 'super-sticker';
};

export type MembershipItem = Omit<NormalChatItem, 'authorType' | 'chatType'> & {
    color: string;
    chatType: 'membership';
};

export type ChatItem =
    | NormalChatItem
    | SuperChatItem
    | SuperStickerItem
    | MembershipItem;
