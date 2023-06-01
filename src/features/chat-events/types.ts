import { type UiChatItem } from '@/components/chat-flow/types';

export type ChatItemState = 'added' | 'finished';

export type State = {
    lastLineNumber: number | undefined;
    chatItems: UiChatItem[];
    chatItemStateById: Record<string, ChatItemState>;
    chatItemsByLineNumber: Record<number, UiChatItem[]>;
};
