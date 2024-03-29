export type Thumbnail = {
    url: string;
    width: number;
    height: number;
};

export type TextPart = {
    text: string;
};

export type EmojiPart = {
    id: string;
    thumbnails: Thumbnail[];
    shortcuts: string[];
};

export type MessagePart = TextPart | EmojiPart;

export type NormalChatItem = {
    id: string;
    messageParts: MessagePart[];
    avatars: Thumbnail[];
    authorName: string;
    authorBadges: string[];
    authorType: 'moderator' | 'member' | 'guest' | 'owner' | 'you' | 'verified';
    chatType: 'normal';
    liveTimestampMs?: number;
    videoTimestampMs?: number;
};

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

export type PinnedChatItem = Omit<NormalChatItem, 'chatType'> & {
    chatType: 'pinned';
};

export type ChatItem =
    | NormalChatItem
    | SuperChatItem
    | SuperStickerItem
    | MembershipItem
    | PinnedChatItem;
