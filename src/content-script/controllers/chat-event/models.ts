export interface NomralChatItem {
    id: string;
    message: string;
    avatarUrl: string;
    timestamp: string;
    authorName: string;
    authorBadge?: string;
}

export type SuperChatItem = Omit<NomralChatItem, 'message'> & {
    donationAmount: string;
    color: string;
    message?: string;
};

export type NewMemberItem = NomralChatItem & {
    color: string;
};
