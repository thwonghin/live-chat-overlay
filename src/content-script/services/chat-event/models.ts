export interface NormalChatItem {
    id: string;
    message: string;
    avatarUrl: string;
    timestamp: string;
    authorName: string;
    authorBadge?: string;
    authorType: 'moderator' | 'member' | 'guest' | 'owner' | 'you';
    chatType: 'normal';
}

export type SuperChatItem = Omit<
    NormalChatItem,
    'message' | 'authorType' | 'chatType'
> & {
    donationAmount: string;
    color: string;
    message?: string;
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
