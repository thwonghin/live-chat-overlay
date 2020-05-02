export interface NomralChatItem {
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
    NomralChatItem,
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

export type MembershipItem = Omit<NomralChatItem, 'authorType' | 'chatType'> & {
    color: string;
    chatType: 'membership';
};

export type ChatItem =
    | NomralChatItem
    | SuperChatItem
    | SuperStickerItem
    | MembershipItem;
